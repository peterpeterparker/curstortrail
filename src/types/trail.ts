export interface Trail {
  id: string;
  title: string;
  description: string;
  distance: number; // in kilometers
  elevation: number; // in meters
  duration: string; // e.g., "2h 30m"
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  location: string;
  date: string; // ISO date string
  gpxFile?: string; // GPX file path in storage
  photos: string[]; // Array of photo file paths
  createdAt: string;
  updatedAt: string;
}

export interface TrailFormData {
  title: string;
  description: string;
  distance: number;
  elevation: number;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  location: string;
  date: string;
  gpxFile?: File;
  photos: File[];
}

export interface GPXPoint {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: string;
}

export interface GPXTrack {
  name: string;
  points: GPXPoint[];
  distance: number;
  elevation: number;
  duration: number;
} 