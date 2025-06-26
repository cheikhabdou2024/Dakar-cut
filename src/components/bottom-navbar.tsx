
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Wand2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Salons", icon: Home },
  { href: "/appointments", label: "Réservations", icon: Calendar },
  { href: "/style-ai", label: "IA Coiffure", icon: Wand2 },
  { href: "/inspiration", label: "Inspiration", icon: Sparkles },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden z-50">
      <div className="container flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md transition-colors text-muted-foreground hover:text-primary",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
