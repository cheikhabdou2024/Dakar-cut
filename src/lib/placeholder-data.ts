
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
  status: 'Open' | 'Closed';
  imageUrl: string;
  gallery: string[];
  reviews: Review[];
  services: Service[];
  stylists: Stylist[];
};

export const salons: Salon[] = [
  {
    id: "1",
    name: "Elegance Coiffure",
    location: "Almadies, Dakar",
    status: "Open",
    imageUrl: "https://placehold.co/600x400.png",
    gallery: [
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
    ],
    reviews: [
      { id: "r1", author: "Fatou Diop", rating: 5, comment: "Amazing service! My hair has never looked better." },
      { id: "r2", author: "Moussa Gueye", rating: 4, comment: "Great place, very professional staff." },
    ],
    services: [
      { id: "s1", name: "Men's Haircut", category: "Coupes", price: 5000, duration: 30 },
      { id: "s2", name: "Women's Cut & Style", category: "Coupes", price: 15000, duration: 90 },
      { id: "s3", name: "Braiding", category: "Tresses", price: 20000, duration: 240 },
    ],
    stylists: [
      { id: "st1", name: "Aminata", specialty: "Coloring", imageUrl: "https://placehold.co/100x100.png", bio: "A passionate colorist with 10 years of experience, specializing in balayage and vibrant color transformations.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
      { id: "st2", name: "Ousmane", specialty: "Men's Cuts", imageUrl: "https://placehold.co/100x100.png", bio: "Expert in modern and classic men's grooming. Precision cuts and sharp fades are my signature.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
    ],
  },
  {
    id: "2",
    name: "Dakar Style Masters",
    location: "Plateau, Dakar",
    status: "Open",
    imageUrl: "https://placehold.co/600x400.png",
    gallery: [
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
    ],
    reviews: [
      { id: "r3", author: "Awa Fall", rating: 5, comment: "The best braids in town!" },
    ],
    services: [
        { id: "s4", name: "Deep Conditioning Treatment", category: "Soins", price: 10000, duration: 60 },
        { id: "s5", name: "Full Head Color", category: "Coloration", price: 25000, duration: 180 },
    ],
    stylists: [
        { id: "st3", name: "Khadija", specialty: "Braiding", imageUrl: "https://placehold.co/100x100.png", bio: "Master braider with a gentle touch. From intricate cornrows to elegant updos, I bring your vision to life.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
        { id: "st4", name: "Ibrahim", specialty: "Styling", imageUrl: "https://placehold.co/100x100.png", bio: "Creative stylist who loves to craft unique and trendy looks for any occasion.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
    ],
  },
  {
    id: "3",
    name: "Le Prestige Barber",
    location: "Mermoz, Dakar",
    status: "Closed",
    imageUrl: "https://placehold.co/600x400.png",
    gallery: [
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
    ],
    reviews: [
      { id: "r4", author: "Cheikh Bamba", rating: 5, comment: "Perfect fade every time." },
    ],
    services: [
        { id: "s1", name: "Men's Haircut", category: "Coupes", price: 6000, duration: 45 },
        { id: "s6", name: "Beard Trim", category: "Coupes", price: 3000, duration: 20 },
    ],
    stylists: [
        { id: "st5", name: "Moussa", specialty: "Barbering", imageUrl: "https://placehold.co/100x100.png", bio: "Dedicated barber focused on clean lines and a perfect finish. Your beard is in good hands.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
    ],
  },
  {
    id: "4",
    name: "Femme Chic",
    location: "Fann, Dakar",
    status: "Open",
    imageUrl: "https://placehold.co/600x400.png",
    gallery: [
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
      "https://placehold.co/800x600.png",
    ],
    reviews: [
      { id: "r5", author: "Mariama Ba", rating: 4, comment: "Good service, but a bit pricey." },
      { id: "r6", author: "Sophie Gomis", rating: 5, comment: "I love my new hairstyle! Thank you!" },
    ],
    services: [
      { id: "s2", name: "Women's Cut & Style", category: "Coupes", price: 18000, duration: 90 },
      { id: "s7", name: "Relaxer", category: "Défrisage", price: 12000, duration: 120 },
    ],
    stylists: [
        { id: "st6", name: "Fatima", specialty: "Styling", imageUrl: "https://placehold.co/100x100.png", bio: "I believe in healthy hair first. Let's create a style that's not only beautiful but also sustainable.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
        { id: "st7", name: "Ndeye", specialty: "Chemical Treatments", imageUrl: "https://placehold.co/100x100.png", bio: "Specializing in relaxers, perms, and treatments to manage and beautify all hair types.", portfolio: ["https://placehold.co/600x800.png", "https://placehold.co/600x800.png", "https://placehold.co/600x800.png"] },
    ],
  },
];

export type Appointment = {
    id: string;
    salonId: string;
    salonName: string;
    serviceNames: string[];
    date: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    cost: number;
}

export const appointments: Appointment[] = [
    { id: 'appt1', salonId: '1', salonName: 'Elegance Coiffure', serviceNames: ["Women's Cut & Style"], date: '2024-08-15', time: '14:00', status: 'Upcoming', cost: 15000 },
    { id: 'appt2', salonId: '2', salonName: 'Dakar Style Masters', serviceNames: ['Braiding'], date: '2024-07-20', time: '10:00', status: 'Completed', cost: 20000 },
    { id: 'appt3', salonId: '4', salonName: 'Femme Chic', serviceNames: ['Relaxer'], date: '2024-07-18', time: '11:30', status: 'Cancelled', cost: 12000 },
]
