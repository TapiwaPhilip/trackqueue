
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Club {
  id: string;
  name: string;
  location: string;
  country: string;
  city: string;
  address: string;
  image: string;
  currentCapacity: number;
  maxCapacity: number;
  waitTimeMinutes: number;
  status: 'Closed' | 'Open' | 'At Capacity' | 'Nearly Full';
  lastUpdated: string; // ISO string
  genres?: string[];
  coordinates?: Coordinates;
  rating?: number;
  isFavorite?: boolean;
}

export interface QueueUpdate {
  id: string;
  clubId: string;
  userId: string;
  userName: string;
  waitTimeMinutes: number;
  peopleCount: number;
  comment: string;
  timestamp: string; // ISO string
  isVerified?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoriteClubs?: string[];
}

export interface FilterOptions {
  country: string;
  city: string;
  genre: string;
  distance: number;
}
