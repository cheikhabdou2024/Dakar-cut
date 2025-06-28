
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Salon } from "@/lib/placeholder-data";
import { MapPin, Star, Image as ImageIcon } from "lucide-react";
import { getSalonImage } from "@/ai/flows/salon-image-flow";
import { Skeleton } from "./ui/skeleton";

interface SalonCardProps {
  salon: Salon;
  distance?: number;
}

const IMAGE_CACHE_PREFIX = "salon-image-cache-";

export function SalonCard({ salon, distance }: SalonCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(salon.imageUrl);
  const [isLoading, setIsLoading] = useState(!salon.imageUrl);

  useEffect(() => {
    let isMounted = true;

    async function generateAndCacheImage() {
      // Check cache first
      try {
        const cachedImage = localStorage.getItem(`${IMAGE_CACHE_PREFIX}${salon.id}`);
        if (cachedImage) {
          if (isMounted) {
            setImageUrl(cachedImage);
            setIsLoading(false);
          }
          return;
        }
      } catch (e) {
        console.warn("localStorage not available for image caching.");
      }
      
      // If not in cache, generate
      setIsLoading(true);
      try {
        const result = await getSalonImage({ prompt: salon.imagePrompt });
        if (isMounted) {
          setImageUrl(result.imageUrl);
          try {
            localStorage.setItem(`${IMAGE_CACHE_PREFIX}${salon.id}`, result.imageUrl);
          } catch (e) {
             console.warn("localStorage not available for image caching.");
          }
        }
      } catch (error) {
        console.error(`Failed to generate image for ${salon.name}:`, error);
        // Fallback to default salon image if generation fails
        if (isMounted) setImageUrl("/assets/images/salons/default-salon.jpg");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (!imageUrl) {
      generateAndCacheImage();
    }

    return () => {
      isMounted = false;
    };
  }, [salon.id, salon.imagePrompt, imageUrl]);

  const averageRating = salon.reviews.length > 0 ? (
    salon.reviews.reduce((acc, review) => acc + review.rating, 0) / salon.reviews.length
  ).toFixed(1) : "0.0";

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {isLoading ? (
             <Skeleton className="w-full h-full" />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Photo de ${salon.name}`}
              fill
              className="object-cover"
            />
          ) : (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
             </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{salon.status}</Badge>
        <h3 className="font-headline text-xl font-bold text-primary">{salon.name}</h3>
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          {salon.location}
          {distance !== undefined && (
            <span className="ml-2 font-semibold">({distance.toFixed(1)} km)</span>
          )}
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
