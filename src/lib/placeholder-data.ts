
import { subDays, addDays, startOfWeek } from 'date-fns';

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // in minutes
};

export type Stylist = {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  bio: string;
  portfolio: string[];
};

export type Salon = {
  id: string;
  name: string;
  location: string;
  status: 'Ouvert' | 'Fermé';
  imagePrompt: string;
  imageUrl: string; // Will be populated by AI at runtime
  gallery: string[];
  reviews: Review[];
  services: Service[];
  stylists: Stylist[];
};

export const salons = [
  {
    id: "1",
    name: "Élégance Coiffure",
    address: "123 Rue de la Beauté, Dakar",
    phone: "+221 33 820 00 00",
    hours: "9:00 AM - 7:00 PM",
    rating: 4.5,
    reviews: 120,
    image: "/assets/images/salons/elegance-coiffure-1.jpg",
    gallery: [
      "/assets/images/salons/elegance-coiffure-2.jpg",
      "/assets/images/salons/elegance-coiffure-3.jpg",
      "/assets/images/salons/default-salon.jpg",
    ],
    description:
      "A luxurious salon offering a wide range of hair and beauty services. Our experienced stylists are dedicated to making you look and feel your best.",
    services: ["Haircuts", "Coloring", "Styling", "Manicures", "Pedicures"],
    stylists: [
      {
        id: "101",
        name: "Aminata Diop",
        rating: 4.8,
        specialties: ["Balayage", "Bridal Hair"],
        image: "/assets/images/stylists/aminata.jpg",
        availability: "available",
      },
      {
        id: "102",
        name: "Ousmane Sow",
        rating: 4.6,
        specialties: ["Fades", "Beard Trims"],
        image: "/assets/images/stylists/ousmane.jpg",
        availability: "unavailable",
      },
    ],
    reviewsData: [
      {
        id: "r1",
        name: "Awa Gueye",
        rating: 5,
        comment: "Amazing service! Aminata is a true artist.",
        avatar: "/assets/images/stylists/default-stylist.jpg",
      },
      {
        id: "r2",
        name: "Moussa Fall",
        rating: 4,
        comment: "Great haircut from Ousmane. Very professional.",
        avatar: "/assets/images/stylists/default-stylist.jpg",
      },
    ],
    latitude: 14.6927,
    longitude: -17.4469,
  },
  {
    id: "2",
    name: "Prestige Barbier",
    address: "45 Avenue des Baobabs, Dakar",
    phone: "+221 33 821 11 11",
    hours: "8:00 AM - 8:00 PM",
    rating: 4.8,
    reviews: 95,
    image: "/assets/images/salons/prestige-barbier-1.jpg",
    gallery: [
      "/assets/images/salons/prestige-barbier-2.jpg",
      "/assets/images/salons/prestige-barbier-3.jpg",
      "/assets/images/salons/default-salon1.jpg",
    ],
    description:
      "The ultimate grooming experience for the modern man. We specialize in classic and contemporary haircuts, shaves, and beard care.",
    services: ["Haircuts", "Shaves", "Beard Trimming", "Facials"],
    stylists: [
      {
        id: "201",
        name: "Jean-Pierre Faye",
        rating: 4.9,
        specialties: ["Hot Towel Shaves", "Skin Fades"],
        image: "/assets/images/stylists/default-stylist.jpg",
        availability: "available",
      },
      {
        id: "202",
        name: "Serigne Mbaye",
        rating: 4.7,
        specialties: ["Afro Styling", "Hair Tattoos"],
        image: "/assets/images/stylists/default-stylist.jpg",
        availability: "available",
      },
    ],
    reviewsData: [
      {
        id: "r3",
        name: "Alioune Diouf",
        rating: 5,
        comment: "Best barber shop in Dakar, hands down.",
        avatar: "/assets/images/stylists/default-stylist.jpg",
      },
    ],
    latitude: 14.7167,
    longitude: -17.4677,
  },
  {
    id: "3",
    name: "Femme Chic",
    address: "78 Boulevard de la République, Dakar",
    phone: "+221 33 822 22 22",
    hours: "10:00 AM - 6:00 PM",
    rating: 4.3,
    reviews: 78,
    image: "/assets/images/salons/femme-chic-1.jpg",
    gallery: [
      "/assets/images/salons/femme-chic-2.jpg",
      "/assets/images/salons/femme-chic-3.jpg",
      "/assets/images/salons/default-salon.jpg",
    ],
    description:
      "Your one-stop shop for all things beauty. We offer a wide range of services, from hair styling to makeup and waxing.",
    services: ["Haircuts", "Coloring", "Makeup", "Waxing", "Nails"],
    stylists: [
      {
        id: "301",
        name: "Fatou Ndiaye",
        rating: 4.5,
        specialties: ["Evening Makeup", "Gel Nails"],
        image: "/assets/images/stylists/default-stylist.jpg",
        availability: "unavailable",
      },
    ],
    reviewsData: [
      {
        id: "r4",
        name: "Mariama Ba",
        rating: 4,
        comment: "I love my new hair color! Thank you, Fatou.",
        avatar: "/assets/images/stylists/default-stylist.jpg",
      },
    ],
    latitude: 14.6627,
    longitude: -17.4369,
  },
  {
    id: "4",
    name: "Les Maîtres du Style",
    address: "10 Rue de la Mode, Dakar",
    phone: "+221 33 823 33 33",
    hours: "9:30 AM - 7:30 PM",
    rating: 4.6,
    reviews: 150,
    image: "/assets/images/salons/maitres-style-1.jpg",
    gallery: [
      "/assets/images/salons/maitres-style-2.jpg",
      "/assets/images/salons/maitres-style-3.jpg",
      "/assets/images/salons/default-salon1.jpg",
    ],
    description:
      "A team of master stylists dedicated to creating the perfect look for you. We stay up-to-date on the latest trends and techniques.",
    services: ["Creative Cuts", "Vivid Colors", "Hair Extensions"],
    stylists: [
      {
        id: "401",
        name: "Isabelle Sagna",
        rating: 4.8,
        specialties: ["Rainbow Hair", "Keratin Treatments"],
        image: "/assets/images/stylists/default-stylist.jpg",
        availability: "available",
      },
      {
        id: "402",
        name: "Thomas Mendy",
        rating: 4.5,
        specialties: ["Geometric Cuts", "Men's Coloring"],
        image: "/assets/images/stylists/default-stylist.jpg",
        availability: "available",
      },
    ],
    reviewsData: [
      {
        id: "r5",
        name: "Sophie Gomis",
        rating: 5,
        comment:
          "Isabelle is a magician! I've never been happier with my hair.",
        avatar: "/assets/images/stylists/default-stylist.jpg",
      },
    ],
    latitude: 14.6827,
    longitude: -17.4569,
  },
];

export const stylists = salons.flatMap((s) => s.stylists);

export const reviews = salons.flatMap((s) => s.reviewsData);

export const locations = salons.map((salon) => ({
  id: salon.id,
  name: salon.name,
  latitude: salon.latitude,
  longitude: salon.longitude,
}));


export type Appointment = {
    id: string;
    salonId: string;
    salonName: string;
    stylistId?: string;
    stylistName?: string;
    serviceNames: string[];
    date: string;
    time: string;
    status: 'À venir' | 'Terminé' | 'Annulé';
    cost: number;
    duration: number; // in minutes
}

const today = new Date();
const toDateString = (date: Date): string => date.toISOString().split('T')[0];

const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
const startOfLastWeek = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });

export const appointments: Appointment[] = [
    // Today
    { "id": "appt-today-1", "salonId": "1", "salonName": "Élégance Coiffure", "stylistId": "st1", "stylistName": "Aminata", "serviceNames": ["Coupe & Coiffage Femme"], "date": toDateString(today), "time": "10:00", "status": "Terminé", "cost": 15000, "duration": 90 },
    { "id": "appt-today-2", "salonId": "2", "salonName": "Maîtres du Style de Dakar", "serviceNames": ["Soin Revitalisant Profond"], "date": toDateString(today), "time": "11:00", "status": "Terminé", "cost": 10000, "duration": 60 },
    { "id": "appt-today-3", "salonId": "1", "salonName": "Élégance Coiffure", "stylistId": "st2", "stylistName": "Ousmane", "serviceNames": ["Coupe Homme"], "date": toDateString(today), "time": "14:30", "status": "À venir", "cost": 5000, "duration": 30 },
    // Yesterday
    { "id": "appt-yest-1", "salonId": "4", "salonName": "Femme Chic", "stylistId": "st6", "stylistName": "Fatima", "serviceNames": ["Défrisage"], "date": toDateString(subDays(today, 1)), "time": "09:00", "status": "Terminé", "cost": 12000, "duration": 120 },
    { "id": "appt-yest-2", "salonId": "1", "salonName": "Élégance Coiffure", "serviceNames": ["Coupe Homme"], "date": toDateString(subDays(today, 1)), "time": "15:00", "status": "Terminé", "cost": 5000, "duration": 30 },
    { "id": "appt-yest-3", "salonId": "2", "salonName": "Maîtres du Style de Dakar", "serviceNames": ["Coloration Tête Complète"], "date": toDateString(subDays(today, 1)), "time": "14:00", "status": "Annulé", "cost": 25000, "duration": 180 },
    // This week (past, relative to start of week)
    { "id": "appt-thisweek-1", "salonId": "1", "salonName": "Élégance Coiffure", "serviceNames": ["Tresses"], "date": toDateString(startOfThisWeek), "time": "10:00", "status": "Terminé", "cost": 20000, "duration": 240 },
    // This week (future)
    { "id": "appt-thisweek-2", "salonId": "3", "salonName": "Le Prestige Barbier", "stylistId": "st5", "stylistName": "Moussa", "serviceNames": ["Taille de Barbe", "Coupe Homme"], "date": toDateString(addDays(today, 1)), "time": "16:00", "status": "À venir", "cost": 9000, "duration": 65 },
    { "id": "appt-thisweek-3", "salonId": "2", "salonName": "Maîtres du Style de Dakar", "stylistId": "st3", "stylistName": "Khadija", "serviceNames": ["Tresses"], "date": toDateString(addDays(today, 2)), "time": "09:30", "status": "À venir", "cost": 20000, "duration": 240 },
     // Last week
    { "id": "appt-lastweek-1", "salonId": "1", "salonName": "Élégance Coiffure", "stylistId": "st1", "stylistName": "Aminata", "serviceNames": ["Coloration Tête Complète"], "date": toDateString(addDays(startOfLastWeek, 1)), "time": "14:00", "status": "Terminé", "cost": 25000, "duration": 180 },
    { "id": "appt-lastweek-2", "salonId": "4", "salonName": "Femme Chic", "serviceNames": ["Coupe & Coiffage Femme"], "date": toDateString(addDays(startOfLastWeek, 2)), "time": "11:30", "status": "Terminé", "cost": 18000, "duration": 90 },
    { "id": "appt-lastweek-3", "salonId": "2", "salonName": "Maîtres du Style de Dakar", "serviceNames": ["Soin Revitalisant Profond", "Coupe & Coiffage Femme"], "date": toDateString(addDays(startOfLastWeek, 3)), "time": "15:30", "status": "Terminé", "cost": 25000, "duration": 150 },
    { "id": "appt-lastweek-4", "salonId": "1", "salonName": "Élégance Coiffure", "serviceNames": ["Coupe Homme"], "date": toDateString(addDays(startOfLastWeek, 4)), "time": "09:00", "status": "Terminé", "cost": 5000, "duration": 30 },
    // Other past appointments
    { "id": 'appt2', salonId: '2', salonName: 'Maîtres du Style de Dakar', stylistId: 'st3', stylistName: 'Khadija', serviceNames: ['Tresses'], date: toDateString(subDays(today, 30)), time: '10:00', status: 'Terminé', cost: 20000, duration: 240 },
    { "id": 'appt3', salonId: '4', salonName: 'Femme Chic', serviceNames: ['Défrisage'], date: toDateString(subDays(today, 32)), time: '11:30', "status": "Annulé", "cost": 12000, duration: 120 },
];
