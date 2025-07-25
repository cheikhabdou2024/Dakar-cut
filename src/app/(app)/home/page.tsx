
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

// Haversine formula to calculate distance between two points on Earth
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

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

    if (activeFilter === 'nearMe' && userLocation) {
      results = [...results].sort((a, b) => {
        const distA = getDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = getDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    }

    setFilteredSalons(results);
  }, [searchQuery, activeFilter, salons, selectedServices, userLocation]);
  
  const handleFilterClick = (filter: string) => {
    if (filter === 'nearMe') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setActiveFilter(prev => prev === filter ? null : filter);
        }, () => {
          alert('Unable to retrieve your location.');
        });
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    } else {
      setActiveFilter(prev => prev === filter ? null : filter);
    }
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
          Dakar Coiffure Connect
        </h1>
        <p className="text-lg text-muted-foreground">
          Votre style, votre temps. Trouvez et réservez les meilleurs salons à Dakar.
        </p>
      </header>

      <div className="mb-12 p-6 bg-card rounded-lg shadow-md">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un salon, un service, ou un lieu..."
            className="pl-10 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant={activeFilter === 'nearMe' ? 'default' : 'secondary'} onClick={() => handleFilterClick('nearMe')}>
            <MapPin className="mr-2" />
            Près de moi
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
                  <h4 className="font-medium leading-none">Filtrer par Service</h4>
                  <p className="text-sm text-muted-foreground">
                    Afficher les salons qui offrent tous les services sélectionnés.
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
            Mieux Notés
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 ml-auto">
            Trouver des Salons
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-headline text-3xl font-semibold mb-6 text-primary">
          {searchQuery || activeFilter || selectedServices.length > 0 ? `${filteredSalons.length} Résultats Trouvés` : "Salons en Vedette"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} distance={userLocation ? getDistance(userLocation.latitude, userLocation.longitude, salon.latitude, salon.longitude) : undefined} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Aucun salon ne correspond à vos critères.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
