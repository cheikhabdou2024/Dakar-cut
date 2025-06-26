
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appointments as initialAppointments, type Appointment, salons as initialSalons, type Salon } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Scissors, Tag, CheckCircle, XCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ReviewDialog } from "@/components/review-dialog";

const APPOINTMENTS_STORAGE_KEY = 'dakar-hair-connect-appointments';
const SALONS_STORAGE_KEY = 'dakar-hair-connect-salons';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const { toast } = useToast();

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<Appointment | null>(null);

  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        setAppointments(initialAppointments);
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initialAppointments));
      }
    } catch (error) {
      console.error("Failed to process appointments from localStorage", error);
      setAppointments(initialAppointments);
    }
    setIsLoading(false);
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'À venir');
  const pastAppointments = appointments.filter(a => a.status !== 'À venir');

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedAppointmentId) return;

    const updatedAppointments = appointments.map(appt =>
      appt.id === selectedAppointmentId ? { ...appt, status: 'Annulé' as const } : appt
    );

    setAppointments(updatedAppointments);
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));

    toast({
      title: "Rendez-vous Annulé",
      description: "Votre rendez-vous a bien été annulé.",
    });

    setIsCancelDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleLeaveReviewClick = (appointment: Appointment) => {
    setSelectedAppointmentForReview(appointment);
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = (salonId: string, rating: number, comment: string) => {
    try {
        const storedSalonsRaw = localStorage.getItem(SALONS_STORAGE_KEY);
        let salons: Salon[] = storedSalonsRaw ? JSON.parse(storedSalonsRaw) : initialSalons;

        const salonIndex = salons.findIndex(s => s.id === salonId);
        
        if (salonIndex > -1) {
            const newReview = {
                id: `rev-${Date.now()}`,
                author: "Utilisateur Invité", // Hardcoded as no auth
                rating,
                comment,
            };
            
            if (!salons[salonIndex].reviews) {
                salons[salonIndex].reviews = [];
            }
            salons[salonIndex].reviews.push(newReview);
            
            localStorage.setItem(SALONS_STORAGE_KEY, JSON.stringify(salons));
            
            toast({ 
                title: "Avis soumis !", 
                description: "Merci pour votre commentaire." 
            });
            setIsReviewDialogOpen(false);
        } else {
             toast({ variant: "destructive", title: "Erreur", description: "Impossible de trouver le salon pour soumettre l'avis." });
        }
    } catch (error) {
        console.error("Failed to submit review", error);
        toast({ variant: "destructive", title: "Erreur", description: "Un problème est survenu lors de la soumission de votre avis." });
    }
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Annulé':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold text-primary">Mes Rendez-vous</h1>
          <p className="text-muted-foreground">Gérez vos réservations passées et futures.</p>
        </header>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Historique</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <Card key={appt.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-headline text-primary">{appt.salonName}</CardTitle>
                      <Badge variant={appt.status === 'À venir' ? 'default' : 'secondary'} className="w-fit flex items-center">
                        {getStatusIcon(appt.status)}
                        <span className="ml-2">{appt.status}</span>
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div className="flex items-center text-sm"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> {formatDate(appt.date)}</div>
                      <div className="flex items-center text-sm"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.time}</div>
                      <div className="flex items-start text-sm"><Scissors className="mr-2 h-4 w-4 text-muted-foreground mt-1" /> <div>{appt.serviceNames.join(', ')}</div></div>
                      {appt.stylistName && (
                        <div className="flex items-center text-sm"><User className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.stylistName}</div>
                      )}
                      <div className="flex items-center text-sm"><Tag className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.cost} FCFA</div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" disabled>Modifier</Button>
                      <Button variant="destructive" onClick={() => handleCancelClick(appt.id)}>Annuler</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>Vous n'avez aucun rendez-vous à venir.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appt) => (
                  <Card key={appt.id} className="flex flex-col opacity-80">
                    <CardHeader>
                      <CardTitle className="font-headline">{appt.salonName}</CardTitle>
                      <Badge variant="secondary" className="w-fit flex items-center">
                        {getStatusIcon(appt.status)}
                        <span className="ml-2">{appt.status}</span>
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div className="flex items-center text-sm"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> {formatDate(appt.date)}</div>
                      <div className="flex items-center text-sm"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.time}</div>
                      <div className="flex items-start text-sm"><Scissors className="mr-2 h-4 w-4 text-muted-foreground mt-1" /> <div>{appt.serviceNames.join(', ')}</div></div>
                       {appt.stylistName && (
                        <div className="flex items-center text-sm"><User className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.stylistName}</div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {appt.status === 'Terminé' && <Button onClick={() => handleLeaveReviewClick(appt)}>Laisser un avis</Button>}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>Vous n'avez aucun rendez-vous passé.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela annulera définitivement votre rendez-vous.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/90">
              Oui, annuler le rendez-vous
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedAppointmentForReview && (
         <ReviewDialog
            open={isReviewDialogOpen}
            onOpenChange={setIsReviewDialogOpen}
            salonId={selectedAppointmentForReview.salonId}
            salonName={selectedAppointmentForReview.salonName}
            onReviewSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
}
