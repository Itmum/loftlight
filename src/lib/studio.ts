export type StudioData = {
  title: string;
  category: string;
  hourlyRate: number | "";
  deposit: number | "";
  capacity: number | "";
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
};

export type StudioType = {
  id: string;
  title: string;
  category: string;
  hourlyRate: number | "";
  deposit: number | "";
  capacity: number | "";
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
};

export interface IStudio {
  id: string;
  title: string;
  category: string;
  hourlyRate: number | "";
  deposit: number | "";
  capacity: number | "";
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
}

// Shape actually returned by the backend API (e.g. GET /all-studios).
// The types above model the add-studio form (string-or-number inputs);
// this one models the stored record with its MongoDB `_id`.
export type Studio = {
  _id: string;
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
  ownerName?: string;
  ownerEmail?: string;
  rating?: number;
  createdAt?: string;
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
