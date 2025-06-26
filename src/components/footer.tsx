
"use client";

import { usePathname } from 'next/navigation';
import { Scissors, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();

  // Do not render the footer on the root or onboarding pages
  if (pathname === '/' || pathname === '/onboarding') {
    return null;
  }
  
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Scissors className="h-6 w-6 text-primary mr-2" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dakar Coiffure Connect. Tous droits réservés.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Facebook className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
