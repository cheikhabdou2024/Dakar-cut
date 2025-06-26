
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalonCard } from "@/components/salon-card";
import { salons as allSalons, type Salon } from "@/lib/placeholder-data";
import { Search, MapPin, Scissors, Star } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>(allSalons);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = allSalons.filter(salon =>
      salon.name.toLowerCase().includes(lowercasedQuery) ||
      salon.location.toLowerCase().includes(lowercasedQuery) ||
      salon.services.some(service => service.name.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredSalons(results);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary mb-2">
          Dakar Hair Connect
        </h1>
        <p className="text-lg text-muted-foreground">
          Your style, your time. Find and book the best salons in Dakar.
        </p>
      </header>

      <div className="mb-12 p-6 bg-card rounded-lg shadow-md">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for a salon, service, or location..."
            className="pl-10 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary">
            <MapPin className="mr-2" />
            Near me
          </Button>
          <Button variant="secondary">
            <Scissors className="mr-2" />
            Services
          </Button>
           <Button variant="secondary">
            <Star className="mr-2" />
            Top Rated
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 ml-auto">
            Find Salons
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-headline text-3xl font-semibold mb-6 text-primary">
          {searchQuery ? `${filteredSalons.length} Results Found` : "Featured Salons"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No salons found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
