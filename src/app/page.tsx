"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, Loader2 } from 'lucide-react';

export default function GatekeeperPage() {
  const router = useRouter();

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      try {
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        if (onboardingComplete === 'true') {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error("LocalStorage not available, redirecting to onboarding.");
        router.replace('/onboarding');
      }
    }, 2000); // 2 second splash screen

    return () => clearTimeout(splashTimer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <Scissors className="h-24 w-24 text-primary-foreground animate-pulse" />
      <h1 className="font-headline text-4xl text-primary-foreground mt-4">Dakar Coiffure Connect</h1>
      <Loader2 className="h-8 w-8 text-primary-foreground animate-spin mt-8" />
    </div>
  );
}
