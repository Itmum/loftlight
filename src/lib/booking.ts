export interface Booking {
  _id: string;
  userName?: string;
  userEmail: string;
  userImage?: string;
  studioId: string;
  title: string;
  titleKey?: string;
  category: string;
  hourlyRate: number;
  deposit: number;
  capacity: number;
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  rating?: number;
  createdAt: string;
  eventDate: string;
  bookingDate: string;
  status: "Pending" | "Confirmed" | "Cancelled" | string;
}
