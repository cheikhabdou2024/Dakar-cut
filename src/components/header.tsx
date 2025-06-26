
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Scissors, Sparkles, Menu, TestTube2 } from "lucide-react";

export function Header() {
  const navItems = [
    { href: "/", label: "Find a Salon" },
    { href: "/appointments", label: "My Appointments" },
    { href: "/dashboard", label: "For Stylists" },
    { href: "/style-ai", label: "Style AI" },
    { href: "/inspiration", label: "Inspiration" },
    { href: "/recommender", label: "Product AI" },
  ];

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

        {/* Mobile Navigation Trigger */}
        <div className="flex flex-1 justify-end lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Menu className="h-6 w-6"/>
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                    <nav className="flex flex-col h-full">
                        <div className="border-b pb-4 mb-4">
                            <Link href="/" className="flex items-center">
                                <Scissors className="h-6 w-6 text-primary mr-2" />
                                <span className="font-bold font-headline text-lg">Dakar Hair Connect</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-1 flex-grow">
                            {navItems.map((item) => (
                               <Link key={item.label} href={item.href} className="text-lg font-medium rounded-md p-3 hover:bg-accent">
                                   {item.label}
                               </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-2">
                             <Button variant="outline">Log In</Button>
                             <Button>Sign Up</Button>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
