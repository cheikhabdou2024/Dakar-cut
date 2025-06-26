
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Salon, Appointment } from "@/lib/placeholder-data";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Scissors, User, Calendar as CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { appointments as initialAppointments } from "@/lib/placeholder-data";
import { fr } from 'date-fns/locale';

interface BookingDialogProps {
  salon: Salon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const APPOINTMENTS_STORAGE_KEY = 'dakar-hair-connect-appointments';

export function BookingDialog({ salon, open, onOpenChange }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      try {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        const loadedAppointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : initialAppointments;
        setAllAppointments(loadedAppointments);
      } catch (error) {
        console.error("Failed to load appointments from localStorage", error);
        setAllAppointments(initialAppointments);
      }
    }
  }, [open]);

  const totalCost = salon.services
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, s) => acc + s.price, 0);

  const totalDuration = salon.services
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, s) => acc + s.duration, 0);

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

  useEffect(() => {
    if (!selectedDate || totalDuration === 0) {
      setBookedSlots([]);
      return;
    }

    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const appointmentsOnDate = allAppointments.filter(
      (appt) =>
        new Date(appt.date).toDateString() === selectedDate.toDateString() &&
        appt.salonId === salon.id &&
        appt.status !== 'Annulé'
    );

    let relevantAppointments = appointmentsOnDate;
    if (selectedStylist && selectedStylist !== 'any') {
      relevantAppointments = appointmentsOnDate.filter(
        (appt) => appt.stylistId === selectedStylist
      );
    }

    const newAppointmentDuration = totalDuration;
    const unavailableSlots = new Set<string>();
    const lunchStart = timeToMinutes('12:00');
    const lunchEnd = timeToMinutes('14:00');
    const closingTime = timeToMinutes('17:00');

    timeSlots.forEach((slot) => {
      const newApptStart = timeToMinutes(slot);
      const newApptEnd = newApptStart + newAppointmentDuration;

      for (const existingAppt of relevantAppointments) {
        const existingApptStart = timeToMinutes(existingAppt.time);
        const existingApptEnd = existingApptStart + existingAppt.duration;

        if (newApptStart < existingApptEnd && newApptEnd > existingApptStart) {
          unavailableSlots.add(slot);
          break;
        }
      }

      if (newApptStart < lunchEnd && newApptEnd > lunchStart) {
        unavailableSlots.add(slot);
      }

      if (newApptEnd > closingTime) {
        unavailableSlots.add(slot);
      }
    });

    const newBookedSlots = Array.from(unavailableSlots);
    setBookedSlots(newBookedSlots);

    // If the currently selected time becomes unavailable, reset it and notify the user.
    if (selectedTime && newBookedSlots.includes(selectedTime)) {
      setSelectedTime(null);
      // Only show toast if the user is on the time selection step to avoid confusion.
      if (step === 3) {
        toast({
            variant: "destructive",
            title: "Créneau horaire non disponible",
            description: "Le créneau sélectionné n'est plus disponible suite à d'autres changements. Veuillez en choisir un autre.",
        });
      }
    }
  }, [selectedDate, selectedStylist, totalDuration, allAppointments, salon.id, step, selectedTime, toast]);


  const resetState = () => {
    setStep(1);
    setSelectedServices([]);
    setSelectedStylist(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
    setBookedSlots([]);
  }

  const handleBooking = () => {
    const stylist = selectedStylist ? salon.stylists.find(s => s.id === selectedStylist) : undefined;
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      salonId: salon.id,
      salonName: salon.name,
      stylistId: selectedStylist && selectedStylist !== 'any' ? selectedStylist : undefined,
      stylistName: selectedStylist && selectedStylist !== 'any' ? stylist?.name : undefined,
      serviceNames: salon.services
        .filter((s) => selectedServices.includes(s.id))
        .map((s) => s.name),
      date: selectedDate!.toISOString(),
      time: selectedTime!,
      status: 'À venir',
      cost: totalCost,
      duration: totalDuration,
    };

    let currentAppointments: Appointment[] = [];
    try {
      const storedAppointmentsRaw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      currentAppointments = storedAppointmentsRaw ? JSON.parse(storedAppointmentsRaw) : initialAppointments;
    } catch (error) {
        console.error("Failed to parse appointments from localStorage", error);
        currentAppointments = initialAppointments;
    }
    
    const updatedAppointments = [...currentAppointments, newAppointment];
    try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
    } catch (error)        {
        console.error("Failed to save appointments to localStorage", error);
        toast({
            variant: "destructive",
            title: "Échec de la réservation",
            description: "Impossible d'enregistrer votre rendez-vous. Veuillez réessayer.",
        });
        return;
    }

    toast({
      title: "Réservation Confirmée !",
      description: `Votre rendez-vous à ${salon.name} est confirmé pour le ${selectedDate?.toLocaleDateString('fr-FR')} à ${selectedTime}.`,
    });
    onOpenChange(false);
    resetState();
  };
  
  const handleClose = (openState: boolean) => {
    if (!openState) {
      resetState();
    }
    onOpenChange(openState);
  }

  const handleServiceChange = (serviceId: string) => {
    const newSelectedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];
    setSelectedServices(newSelectedServices);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2"><Scissors />Sélectionner les Services</DialogTitle>
              <DialogDescription>Choisissez un ou plusieurs services que vous souhaitez réserver.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-64 overflow-y-auto">
              {salon.services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <Checkbox id={service.id} onCheckedChange={() => handleServiceChange(service.id)} checked={selectedServices.includes(service.id)} />
                  <Label htmlFor={service.id} className="flex-1 flex justify-between items-center cursor-pointer">
                    <span>{service.name}</span>
                    <span className="font-bold text-primary">{service.price} FCFA</span>
                  </Label>
                </div>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2"><User />Choisir un(e) Styliste</DialogTitle>
              <DialogDescription>Sélectionnez votre styliste préféré(e) ou choisissez n'importe quel(le) disponible.</DialogDescription>
            </DialogHeader>
            <RadioGroup onValueChange={setSelectedStylist} value={selectedStylist ?? "any"} className="py-4">
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any" className="cursor-pointer">N'importe quel(le) disponible</Label>
              </div>
              {salon.stylists.map((stylist) => (
                <div key={stylist.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <RadioGroupItem value={stylist.id} id={stylist.id} />
                  <Label htmlFor={stylist.id} className="cursor-pointer">{stylist.name} - ({stylist.specialty})</Label>
                </div>
              ))}
            </RadioGroup>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2"><CalendarIcon />Sélectionner la Date & l'Heure</DialogTitle>
              <DialogDescription>Choisissez une date et une heure pour votre rendez-vous.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col md:flex-row gap-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                  className="rounded-md border"
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  locale={fr}
                />
                <div className="grid grid-cols-3 gap-2 h-full max-h-64 overflow-y-auto">
                  {timeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)} disabled={bookedSlots.includes(time)}>
                      {time}
                    </Button>
                  ))}
                </div>
            </div>
          </>
        );
      case 4:
        return (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl flex items-center gap-2"><CheckCircle />Confirmer la Réservation</DialogTitle>
                <DialogDescription>Veuillez vérifier les détails de votre rendez-vous ci-dessous.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div><strong>Salon :</strong> {salon.name}</div>
                <div><strong>Services :</strong> {salon.services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(', ')}</div>
                <div><strong>Styliste :</strong> {selectedStylist === 'any' || !selectedStylist ? 'N\'importe quel(le) disponible' : salon.stylists.find(s => s.id === selectedStylist)?.name}</div>
                <div><strong>Date :</strong> {selectedDate?.toLocaleDateString('fr-FR')}</div>
                <div><strong>Heure :</strong> {selectedTime}</div>
                <hr/>
                <div className="font-bold text-lg">Coût Total : <span className="text-primary">{totalCost} FCFA</span></div>
                <div className="text-muted-foreground">Durée Estimée : {totalDuration} minutes</div>
              </div>
            </>
        )
      default:
        return null;
    }
  };
  
  const handleNextStep = () => {
    // When leaving step 3, if the currently selected time is now disabled, reset it
    if (step === 3 && selectedTime && bookedSlots.includes(selectedTime)) {
      setSelectedTime(null);
    }
    setStep(step + 1);
  };

  const handleBackStep = () => {
      setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[700px]">
        {renderStep()}
        <DialogFooter className="flex justify-between w-full">
            {step > 1 && <Button variant="outline" onClick={handleBackStep}><ArrowLeft className="mr-2 h-4 w-4"/> Retour</Button>}
            {step < 4 && <Button onClick={handleNextStep} disabled={(step === 1 && selectedServices.length === 0) || (step === 2 && !selectedStylist) || (step === 3 && (!selectedDate || !selectedTime || (selectedTime && bookedSlots.includes(selectedTime))))} className="ml-auto">Suivant <ArrowRight className="ml-2 h-4 w-4"/></Button>}
            {step === 4 && <Button onClick={handleBooking} className="bg-green-600 hover:bg-green-700">Confirmer le Rendez-vous</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
