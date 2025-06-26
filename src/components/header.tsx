
import Link from "next/link";
import { Button } from "./ui/button";
import { Scissors, Sparkles, TestTube2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center mr-6">
          <Scissors className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold font-headline text-lg">Dakar Hair Connect</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">Find a Salon</Link>
          <Link href="/appointments" className="transition-colors hover:text-primary">My Appointments</Link>
          <Link href="/dashboard" className="transition-colors hover:text-primary">For Stylists</Link>
          <Link href="/style-ai" className="transition-colors hover:text-primary">Style AI</Link>
          <Link href="/inspiration" className="transition-colors hover:text-primary flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Inspiration
          </Link>
           <Link href="/recommender" className="transition-colors hover:text-primary flex items-center gap-1">
              <TestTube2 className="h-4 w-4" />
              Product AI
          </Link>
        </nav>
        
        <div className="hidden lg:flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>

        {/* Mobile sheet menu has been replaced by the new bottom navigation bar */}
      </div>
    </header>
  );
}
