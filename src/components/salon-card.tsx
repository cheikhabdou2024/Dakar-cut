
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Salon } from "@/lib/placeholder-data";
import { MapPin, Star } from "lucide-react";

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  const averageRating = (
    salon.reviews.reduce((acc, review) => acc + review.rating, 0) / salon.reviews.length
  ).toFixed(1);

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={salon.imageUrl}
            alt={`Photo de ${salon.name}`}
            fill
            className="object-cover"
            data-ai-hint="salon interior"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{salon.status}</Badge>
        <h3 className="font-headline text-xl font-bold text-primary">{salon.name}</h3>
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          {salon.location}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div className="flex items-center font-bold">
          <Star className="h-5 w-5 text-accent fill-current mr-1" />
          <span>{averageRating}</span>
          <span className="text-sm font-normal text-muted-foreground ml-1">({salon.reviews.length} avis)</span>
        </div>
        <Button asChild>
          <Link href={`/salons/${salon.id}`}>Voir</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
