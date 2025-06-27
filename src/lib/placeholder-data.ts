
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

export const salons: Salon[] = [
  {
    id: "1",
    name: "Élégance Coiffure",
    location: "Almadies, Dakar",
    status: "Ouvert",
    imagePrompt: "a bright, luxurious hair salon interior with marble floors, gold accents, and large mirrors",
    imageUrl: "",
    gallery: [
      "/assets/images/salons/elegance-coiffure-1.jpg",
      "/assets/images/salons/elegance-coiffure-2.jpg",
      "/assets/images/salons/elegance-coiffure-3.jpg",
    ],
    reviews: [
      { id: "r1", author: "Fatou Diop", rating: 5, comment: "Service incroyable ! Mes cheveux n'ont jamais été aussi beaux." },
      { id: "r2", author: "Moussa Gueye", rating: 4, comment: "Super endroit, personnel très professionnel." },
    ],
    services: [
      { id: "s1", name: "Coupe Homme", category: "Coupes", price: 5000, duration: 30 },
      { id: "s2", name: "Coupe & Coiffage Femme", category: "Coupes", price: 15000, duration: 90 },
      { id: "s3", name: "Tresses", category: "Tresses", price: 20000, duration: 240 },
      { id: "s5", name: "Coloration Tête Complète", category: "Coloration", price: 25000, duration: 180 },
      { id: "s4", name: "Soin Revitalisant Profond", category: "Soins", price: 10000, duration: 60 },
    ],
    stylists: [
      { id: "st1", name: "Aminata", specialty: "Coloration", imageUrl: "/assets/images/stylists/aminata.jpg", bio: "Coloriste passionnée avec 10 ans d'expérience, spécialisée en balayage et transformations de couleurs vibrantes.", portfolio: ["/assets/images/stylists/aminata-work-1.jpg", "/assets/images/stylists/aminata-work-2.jpg", "/assets/images/stylists/aminata-work-3.jpg"] },
      { id: "st2", name: "Ousmane", specialty: "Coupes Homme", imageUrl: "/assets/images/stylists/ousmane.jpg", bio: "Expert en soins pour hommes modernes et classiques. Coupes de précision et dégradés nets sont ma signature.", portfolio: ["/assets/images/stylists/ousmane-work-1.jpg", "/assets/images/stylists/ousmane-work-2.jpg", "/assets/images/stylists/ousmane-work-3.jpg"] },
    ],
  },
  {
    id: "2",
    name: "Maîtres du Style de Dakar",
    location: "Plateau, Dakar",
    status: "Ouvert",
    imagePrompt: "a chic, urban salon with exposed brick walls, industrial-style lighting, and comfortable styling stations",
    imageUrl: "",
    gallery: [
      "/assets/images/salons/maitres-style-1.jpg",
      "/assets/images/salons/maitres-style-2.jpg",
      "/assets/images/salons/maitres-style-3.jpg",
    ],
    reviews: [
      { id: "r3", author: "Awa Fall", rating: 5, comment: "Les meilleures tresses en ville !" },
    ],
    services: [
        { id: "s4", name: "Soin Revitalisant Profond", category: "Soins", price: 10000, duration: 60 },
        { id: "s5", name: "Coloration Tête Complète", category: "Coloration", price: 25000, duration: 180 },
        { id: "s3", name: "Tresses", category: "Tresses", price: 22000, duration: 260 },
    ],
    stylists: [
        { id: "st3", name: "Khadija", specialty: "Tresses", imageUrl: "/assets/images/stylists/khadija.jpg", bio: "Maîtresse tresseuse au toucher doux. Des nattes collées complexes aux chignons élégants, je donne vie à votre vision.", portfolio: ["/assets/images/stylists/khadija-work-1.jpg", "/assets/images/stylists/khadija-work-2.jpg", "/assets/images/stylists/khadija-work-3.jpg"] },
        { id: "st4", name: "Ibrahim", specialty: "Coiffage", imageUrl: "/assets/images/stylists/ibrahim.jpg", bio: "Styliste créatif qui adore créer des looks uniques et tendance pour toutes les occasions.", portfolio: ["/assets/images/stylists/ibrahim-work-1.jpg", "/assets/images/stylists/ibrahim-work-2.jpg", "/assets/images/stylists/ibrahim-work-3.jpg"] },
    ],
  },
  {
    id: "3",
    name: "Le Prestige Barbier",
    location: "Mermoz, Dakar",
    status: "Fermé",
    imagePrompt: "a classic, old-school barbershop with vintage barber chairs, dark wood paneling, and checkered floors",
    imageUrl: "",
    gallery: [
      "/assets/images/salons/prestige-barbier-1.jpg",
      "/assets/images/salons/prestige-barbier-2.jpg",
      "/assets/images/salons/prestige-barbier-3.jpg",
    ],
    reviews: [
      { id: "r4", author: "Cheikh Bamba", rating: 5, comment: "Dégradé parfait à chaque fois." },
    ],
    services: [
        { id: "s1", name: "Coupe Homme", category: "Coupes", price: 6000, duration: 45 },
        { id: "s6", name: "Taille de Barbe", category: "Barbe", price: 3000, duration: 20 },
    ],
    stylists: [
        { id: "st5", name: "Moussa", specialty: "Barbier", imageUrl: "/assets/images/stylists/moussa.jpg", bio: "Barbier dévoué axé sur les lignes épurées et une finition parfaite. Votre barbe est entre de bonnes mains.", portfolio: ["/assets/images/stylists/moussa-work-1.jpg", "/assets/images/stylists/moussa-work-2.jpg", "/assets/images/stylists/moussa-work-3.jpg"] },
    ],
  },
  {
    id: "4",
    name: "Femme Chic",
    location: "Fann, Dakar",
    status: "Ouvert",
    imagePrompt: "an elegant and feminine salon with pastel colors, plush velvet chairs, and floral decorations",
    imageUrl: "",
    gallery: [
      "/assets/images/salons/femme-chic-1.jpg",
      "/assets/images/salons/femme-chic-2.jpg",
      "/assets/images/salons/femme-chic-3.jpg",
    ],
    reviews: [
      { id: "r5", author: "Mariama Ba", rating: 4, comment: "Bon service, mais un peu cher." },
      { id: "r6", author: "Sophie Gomis", rating: 5, comment: "J'adore ma nouvelle coiffure ! Merci !" },
    ],
    services: [
      { id: "s2", name: "Coupe & Coiffage Femme", category: "Coupes", price: 18000, duration: 90 },
      { id: "s7", name: "Défrisage", category: "Traitements", price: 12000, duration: 120 },
    ],
    stylists: [
        { id: "st6", name: "Fatima", specialty: "Coiffage", imageUrl: "/assets/images/stylists/fatima.jpg", bio: "Je crois d'abord aux cheveux sains. Créons un style qui n'est pas seulement beau, mais aussi durable.", portfolio: ["/assets/images/stylists/fatima-work-1.jpg", "/assets/images/stylists/fatima-work-2.jpg", "/assets/images/stylists/fatima-work-3.jpg"] },
        { id: "st7", name: "Ndeye", specialty: "Traitements Chimiques", imageUrl: "/assets/images/stylists/ndeye.jpg", bio: "Spécialisée dans les défrisages, les permanentes et les soins pour gérer et embellir tous les types de cheveux.", portfolio: ["/assets/images/stylists/ndeye-work-1.jpg", "/assets/images/stylists/ndeye-work-2.jpg", "/assets/images/stylists/ndeye-work-3.jpg"] },
    ],
  },
];

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
