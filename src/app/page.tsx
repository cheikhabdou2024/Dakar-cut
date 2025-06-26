
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalonCard } from "@/components/salon-card";
import { salons as initialSalons, type Salon } from "@/lib/placeholder-data";
import { Search, MapPin, Scissors, Star, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SALONS_STORAGE_KEY = 'dakar-hair-connect-salons';

export default function Home() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<string[]>([]);

  useEffect(() => {
    let loadedSalons: Salon[];
    try {
      const storedSalons = localStorage.getItem(SALONS_STORAGE_KEY);
      if (storedSalons) {
        loadedSalons = JSON.parse(storedSalons);
        setSalons(loadedSalons);
      } else {
        loadedSalons = initialSalons;
        setSalons(initialSalons);
        localStorage.setItem(SALONS_STORAGE_KEY, JSON.stringify(initialSalons));
      }
    } catch (error) {
        console.error("Failed to load salons from localStorage", error);
        loadedSalons = initialSalons;
        setSalons(initialSalons);
    }

    const serviceSet = new Set<string>();
    loadedSalons.forEach(salon => {
      salon.services.forEach(service => {
        serviceSet.add(service.name);
      });
    });
    setAllServices(Array.from(serviceSet).sort());

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let results = salons;

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      results = results.filter(salon =>
        salon.name.toLowerCase().includes(lowercasedQuery) ||
        salon.location.toLowerCase().includes(lowercasedQuery) ||
        salon.services.some(service => service.name.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    // Filter by selected services
    if (selectedServices.length > 0) {
        results = results.filter(salon => 
            selectedServices.every(selectedService => 
                salon.services.some(salonService => salonService.name === selectedService)
            )
        );
    }

    // Apply sorting filters
    if (activeFilter === 'topRated') {
      results = [...results].sort((a, b) => {
        const ratingA = a.reviews.length > 0 ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
        const ratingB = b.reviews.length > 0 ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
        return ratingB - ratingA;
      });
    }

    setFilteredSalons(results);
  }, [searchQuery, activeFilter, salons, selectedServices]);
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button variant="secondary" disabled>
            <MapPin className="mr-2" />
            Near me
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">
                <Scissors className="mr-2" />
                Services {selectedServices.length > 0 && `(${selectedServices.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter by Service</h4>
                  <p className="text-sm text-muted-foreground">
                    Show salons that offer all selected services.
                  </p>
                </div>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {allServices.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox 
                        id={service}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? setSelectedServices(prev => [...prev, service])
                            : setSelectedServices(prev => prev.filter(s => s !== service));
                        }}
                      />
                      <Label htmlFor={service} className="font-normal cursor-pointer">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
           <Button variant={activeFilter === 'topRated' ? 'default' : 'secondary'} onClick={() => handleFilterClick('topRated')}>
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
          {searchQuery || activeFilter || selectedServices.length > 0 ? `${filteredSalons.length} Results Found` : "Featured Salons"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No salons found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
