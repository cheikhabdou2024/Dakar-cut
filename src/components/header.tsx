
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Scissors, Sparkles, TestTube2 } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  // Do not render the header on the root or onboarding pages
  if (pathname === '/' || pathname === '/onboarding') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo and Title */}
        <Link href="/home" className="flex items-center mr-6">
          <Scissors className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold font-headline text-lg">Dakar Coiffure Connect</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          <Link href="/home" className="transition-colors hover:text-primary">Trouver un Salon</Link>
          <Link href="/appointments" className="transition-colors hover:text-primary">Mes Rendez-vous</Link>
          <Link href="/dashboard" className="transition-colors hover:text-primary">Pour les Stylistes</Link>
          <Link href="/ia-coiffure" className="transition-colors hover:text-primary">IA Coiffure</Link>
          <Link href="/inspiration" className="transition-colors hover:text-primary flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Inspiration
          </Link>
           <Link href="/recommender" className="transition-colors hover:text-primary flex items-center gap-1">
              <TestTube2 className="h-4 w-4" />
              IA Produits
          </Link>
        </nav>
        
        <div className="hidden lg:flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost">Se Connecter</Button>
          <Button>S'inscrire</Button>
        </div>

        {/* Mobile sheet menu has been replaced by the new bottom navigation bar */}
      </div>
    </header>
  );
}
