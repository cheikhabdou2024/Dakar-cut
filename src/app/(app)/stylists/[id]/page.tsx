
"use client";

import { useState } from 'react';
import Image from "next/image";
import { notFound, useRouter, useParams } from "next/navigation";
import { salons, type Stylist, type Salon } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Scissors, ArrowLeft, Loader2 } from "lucide-react";
import { BookingDialog } from '@/components/booking-dialog';

export default function StylistPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const router = useRouter();

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Find the stylist and their salon
  let stylist: Stylist | undefined;
  let salon: Salon | undefined;

  for (const s of salons) {
    const foundStylist = s.stylists.find((st) => st.id === id);
    if (foundStylist) {
      stylist = foundStylist;
      salon = s;
      break;
    }
  }

  if (!stylist || !salon) {
    notFound();
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au Salon
        </Button>
        <header className="relative mb-8 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={stylist.imageUrl} alt={stylist.name} data-ai-hint="professional headshot" />
                <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                 <h1 className="font-headline text-5xl font-bold text-primary">{stylist.name}</h1>
                <p className="text-xl text-muted-foreground flex items-center gap-2 mt-2">
                    <Award className="h-5 w-5 text-accent" />
                    Spécialité : {stylist.specialty}
                </p>
                 <p className="text-lg text-muted-foreground mt-1">
                    Travaille chez <span className="font-semibold text-foreground">{salon.name}</span>
                 </p>
            </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">À propos de {stylist.name.split(' ')[0]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{stylist.bio}</p>
                    <Button className="w-full text-lg py-6" onClick={() => setIsBookingOpen(true)}>
                        <Scissors className="mr-2 h-5 w-5"/>
                        Réserver avec {stylist.name.split(' ')[0]}
                    </Button>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-headline text-3xl font-semibold mb-6 text-primary">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stylist.portfolio.map((url, index) => (
                    <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md group">
                        <Image 
                            src={url} 
                            alt={`Image du portfolio ${index + 1} par ${stylist.name}`} 
                            fill
                            style={{objectFit: 'cover'}}
                            data-ai-hint="hairstyle fashion"
                            className="group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <BookingDialog salon={salon} open={isBookingOpen} onOpenChange={setIsBookingOpen} defaultStylistId={stylist.id} />
    </>
  );
}
