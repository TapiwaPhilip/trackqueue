
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

type UserLocation = {
  city: string; 
  country: string; 
  coordinates?: { latitude: number; longitude: number }
};

export const useUserLocation = () => {
  const [userLocation, setUserLocationState] = useState<UserLocation | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const { toast } = useToast();

  const setUserLocation = (
    location: UserLocation, 
    showToast: boolean = false
  ) => {
    setUserLocationState(location);
    if (showToast) {
      toast({
        title: "Location updated",
        description: `Showing clubs near ${location.city}, ${location.country}.`,
      });
    }
  };

  const updateNearbyClubs = (clubs: any[]) => {
    if (userLocation) {
      const filtered = clubs.filter(
        club => club.location.toLowerCase().includes(userLocation.city.toLowerCase())
      );
      setNearbyClubs(filtered);
    }
  };

  return {
    userLocation,
    setUserLocation,
    nearbyClubs,
    updateNearbyClubs,
    setNearbyClubs
  };
};
