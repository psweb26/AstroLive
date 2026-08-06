export type Astrologer = {
  id: string;
  initials: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  languages: string[];
  price: number;
};

export const astrologers: Astrologer[] = [
  {
    id: "ananya-sharma",
    initials: "AS",
    name: "Ananya Sharma",
    specialization: "Vedic Astrology & Birth Charts",
    experience: 12,
    rating: 4.9,
    languages: ["English", "Hindi"],
    price: 799,
  },
  {
    id: "rohan-kapoor",
    initials: "RK",
    name: "Rohan Kapoor",
    specialization: "Career & Relationship Guidance",
    experience: 9,
    rating: 4.8,
    languages: ["English", "Hindi"],
    price: 699,
  },
  {
    id: "meera-patel",
    initials: "MP",
    name: "Meera Patel",
    specialization: "Tarot & Spiritual Guidance",
    experience: 7,
    rating: 4.9,
    languages: ["English", "Gujarati"],
    price: 599,
  },
  {
    id: "arjun-verma",
    initials: "AV",
    name: "Arjun Verma",
    specialization: "Numerology & Life Path",
    experience: 11,
    rating: 4.7,
    languages: ["English", "Hindi"],
    price: 749,
  },
];
