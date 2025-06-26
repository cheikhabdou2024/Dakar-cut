
"use client";

import { useState } from "react";
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

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  
  const totalCost = salon.services
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, s) => acc + s.price, 0);

  const totalDuration = salon.services
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, s) => acc + s.duration, 0);

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

  const resetState = () => {
    setStep(1);
    setSelectedServices([]);
    setSelectedStylist(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
  }

  const handleBooking = () => {
    // 1. Create new appointment object
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      salonId: salon.id,
      salonName: salon.name,
      serviceNames: salon.services
        .filter((s) => selectedServices.includes(s.id))
        .map((s) => s.name),
      date: selectedDate!.toISOString(),
      time: selectedTime!,
      status: 'Upcoming',
      cost: totalCost,
      duration: totalDuration,
    };

    // 2. Read current appointments from localStorage
    let currentAppointments: Appointment[] = [];
    try {
      const storedAppointmentsRaw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      // If storage exists, parse it. Otherwise, start with initial appointments data.
      currentAppointments = storedAppointmentsRaw ? JSON.parse(storedAppointmentsRaw) : initialAppointments;
    } catch (error) {
        console.error("Failed to parse appointments from localStorage", error);
        currentAppointments = initialAppointments;
    }
    
    // 3. Add new appointment and save back to localStorage
    const updatedAppointments = [...currentAppointments, newAppointment];
    try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
    } catch (error) {
        console.error("Failed to save appointments to localStorage", error);
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "Could not save your appointment. Please try again.",
        });
        return;
    }

    // 4. Show toast and close dialog
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment at ${salon.name} is confirmed for ${selectedDate?.toLocaleDateString()} at ${selectedTime}.`,
    });
    onOpenChange(false);
    resetState();
  };
  
  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2"><Scissors />Select Services</DialogTitle>
              <DialogDescription>Choose one or more services you'd like to book.</DialogDescription>
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
              <DialogTitle className="font-headline text-2xl flex items-center gap-2"><User />Choose a Stylist</DialogTitle>
              <DialogDescription>Select your preferred stylist or choose any available.</DialogDescription>
            </DialogHeader>
            <RadioGroup onValueChange={setSelectedStylist} value={selectedStylist ?? "any"} className="py-4">
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any" className="cursor-pointer">Any Available</Label>
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
              <DialogTitle className="font-headline text-2xl flex items-center gap-2"><CalendarIcon />Select Date & Time</DialogTitle>
              <DialogDescription>Pick a date and time for your appointment.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col md:flex-row gap-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
                <div className="grid grid-cols-3 gap-2 h-full max-h-64 overflow-y-auto">
                  {timeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)}>
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
                <DialogTitle className="font-headline text-2xl flex items-center gap-2"><CheckCircle />Confirm Booking</DialogTitle>
                <DialogDescription>Please review your appointment details below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div><strong>Salon:</strong> {salon.name}</div>
                <div><strong>Services:</strong> {salon.services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(', ')}</div>
                <div><strong>Stylist:</strong> {selectedStylist === 'any' ? 'Any Available' : salon.stylists.find(s => s.id === selectedStylist)?.name}</div>
                <div><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</div>
                <div><strong>Time:</strong> {selectedTime}</div>
                <hr/>
                <div className="font-bold text-lg">Total Cost: <span className="text-primary">{totalCost} FCFA</span></div>
                <div className="text-muted-foreground">Estimated Duration: {totalDuration} minutes</div>
              </div>
            </>
        )
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[700px]">
        {renderStep()}
        <DialogFooter className="flex justify-between w-full">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>}
            {step < 4 && <Button onClick={() => setStep(step + 1)} disabled={(step === 1 && selectedServices.length === 0) || (step === 2 && !selectedStylist) || (step === 3 && (!selectedDate || !selectedTime))} className="ml-auto">Next <ArrowRight className="ml-2 h-4 w-4"/></Button>}
            {step === 4 && <Button onClick={handleBooking} className="bg-green-600 hover:bg-green-700">Confirm Appointment</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
