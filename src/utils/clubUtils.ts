
import type { Club, QueueUpdate } from '@/lib/mockData';

export const filterClubsByLocation = (clubs: Club[], city?: string, country?: string) => {
  if (!city && !country) return clubs;
  
  return clubs.filter(club => {
    const locationLower = club.location.toLowerCase();
    const cityMatch = city ? locationLower.includes(city.toLowerCase()) : true;
    const countryMatch = country ? locationLower.includes(country.toLowerCase()) : true;
    return cityMatch && countryMatch;
  });
};

export const filterClubsByGenre = (clubs: Club[], genre?: string) => {
  if (!genre) return clubs;
  
  return clubs.filter(club => 
    club.genres && club.genres.some(g => g.toLowerCase() === genre.toLowerCase())
  );
};

export const filterClubsByDistance = (
  clubs: Club[], 
  maxDistance?: number, 
  userCoordinates?: { latitude: number; longitude: number }
) => {
  if (!maxDistance || !userCoordinates) return clubs;
  
  return clubs.filter(club => {
    if (!club.coordinates) return false;
    
    const distance = calculateDistance(
      userCoordinates.latitude,
      userCoordinates.longitude,
      club.coordinates.latitude,
      club.coordinates.longitude
    );
    
    return distance <= maxDistance;
  });
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const getClubDistance = (
  club: Club,
  userCoordinates?: { latitude: number; longitude: number }
): number | null => {
  if (!userCoordinates || !club.coordinates) return null;
  
  return calculateDistance(
    userCoordinates.latitude,
    userCoordinates.longitude,
    club.coordinates.latitude,
    club.coordinates.longitude
  );
};
