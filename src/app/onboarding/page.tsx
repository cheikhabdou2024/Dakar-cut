"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { MapPin, Wand2, CalendarCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const onboardingSteps = [
  {
    icon: MapPin,
    image: '/assets/images/salons/default-salon.jpg',
    imageHint: 'map search results',
    title: 'Trouvez les meilleurs salons',
    description: 'Explorez une sélection de salons de coiffure et barbiers près de chez vous. Lisez les avis et trouvez votre perle rare.',
  },
  {
    icon: Wand2,
    image: '/assets/images/stylists/default-portfolio.jpg',
    imageHint: 'man hairstyle before after',
    title: 'Essayez un nouveau look avec l\'IA',
    description: 'Téléchargez votre photo et laissez notre intelligence artificielle vous montrer à quoi vous ressembleriez avec une nouvelle coiffure.',
  },
  {
    icon: CalendarCheck,
    image: '/assets/images/salons/default-salon1.jpg',
    imageHint: 'salon interior',
    title: 'Réservez facilement en ligne',
    description: 'Choisissez votre service, votre styliste et votre créneau horaire. Confirmez votre rendez-vous en quelques clics, 24h/24 et 7j/7.',
  },
  {
    icon: Sparkles,
    image: '/assets/images/stylists/default-stylist.jpg',
    imageHint: 'hair products bottles',
    title: 'Obtenez des conseils personnalisés',
    description: 'Notre IA analyse votre type de cheveux et vos objectifs pour vous recommander les produits parfaits pour votre routine capillaire.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  const handleNext = () => {
    if (selectedIndex === onboardingSteps.length - 1) {
      handleFinish();
    } else {
      scrollTo(selectedIndex + 1);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('onboardingComplete', 'true');
    } catch (error) {
      console.error("Could not save to localStorage", error);
    }
    router.replace('/home');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {onboardingSteps.map((step, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
                 <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover rounded-full shadow-lg"
                  data-ai-hint={step.imageHint}
                />
                <div className="absolute -bottom-4 -right-4 bg-primary p-4 rounded-full shadow-lg">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">{step.title}</h2>
              <p className="mt-4 text-muted-foreground max-w-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 border-t">
        <div className="flex justify-center gap-2 mb-6">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2 w-2 rounded-full bg-muted transition-all',
                index === selectedIndex ? 'w-6 bg-primary' : 'hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleFinish}>Passer</Button>
          <Button size="lg" onClick={handleNext}>
            {selectedIndex === onboardingSteps.length - 1 ? 'Commencer' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
}
