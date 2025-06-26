"use client";

import { useState } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";
import { salons } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Scissors } from "lucide-react";
import { BookingDialog } from '@/components/booking-dialog';


export default function SalonPage({ params }: { params: { id: string } }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const salon = salons.find((s) => s.id === params.id);

  if (!salon) {
    notFound();
  }

  const averageRating = (
    salon.reviews.reduce((acc, review) => acc + review.rating, 0) / salon.reviews.length
  ).toFixed(1);

  const serviceCategories = [...new Set(salon.services.map(s => s.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-5xl font-bold text-primary">{salon.name}</h1>
        <div className="flex items-center text-muted-foreground mt-2">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{salon.location}</span>
          <span className="mx-2">|</span>
          <Star className="h-5 w-5 mr-1 text-accent fill-current" />
          <span className="font-bold text-foreground">{averageRating}</span>
          <span className="ml-1">({salon.reviews.length} reviews)</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Carousel className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
            <CarouselContent>
              {salon.gallery.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-96">
                    <Image src={url} alt={`Gallery image ${index + 1} for ${salon.name}`} layout="fill" objectFit="cover" data-ai-hint="salon interior design" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Tabs defaultValue="services" className="w-full">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="stylists">Stylists</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {serviceCategories.map(category => (
                    <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="font-headline text-lg">{category}</AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-4 pt-2">
                             {salon.services.filter(s => s.category === category).map(service => (
                                <li key={service.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                  <div>
                                    <p className="font-semibold">{service.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1.5"/>{service.duration} min</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-primary">{service.price} FCFA</p>
                                    <Button size="sm" variant="ghost" className="h-auto p-1 text-xs" onClick={() => setIsBookingOpen(true)}>Book</Button>
                                  </div>
                                </li>
                             ))}
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            <TabsContent value="stylists" className="mt-4">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {salon.stylists.map(stylist => (
                        <Card key={stylist.id} className="text-center p-4">
                            <Avatar className="h-20 w-20 mx-auto mb-2">
                                <AvatarImage src={stylist.imageUrl} alt={stylist.name} data-ai-hint="professional headshot"/>
                                <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{stylist.name}</p>
                            <p className="text-xs text-muted-foreground">{stylist.specialty}</p>
                        </Card>
                    ))}
               </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {salon.reviews.map(review => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-accent fill-current' : 'text-muted-foreground'}`}/>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">"{review.comment}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Book an Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Find your perfect slot and get ready to be pampered.
                    </p>
                    <Button className="w-full text-lg py-6" onClick={() => setIsBookingOpen(true)}>
                        <Scissors className="mr-2 h-5 w-5"/>
                        Book Now
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      <BookingDialog salon={salon} open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </div>
  );
}
