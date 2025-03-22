
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { clubs as initialClubs, queueUpdates as initialUpdates } from '@/lib/mockData';
import type { Club, QueueUpdate } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';
import { LocationService } from '@/services/LocationService';

type ClubsContextType = {
  clubs: Club[];
  queueUpdates: QueueUpdate[];
  isLoading: boolean;
  favoriteClubIds: string[];
  nearbyClubs: Club[];
  userLocation: { city: string; country: string; coordinates?: { latitude: number; longitude: number } } | null;
  getClub: (id: string) => Club | undefined;
  getClubUpdates: (clubId: string) => QueueUpdate[];
  addQueueUpdate: (update: Omit<QueueUpdate, 'id' | 'timestamp'>) => void;
  refreshClubs: () => void;
  toggleFavorite: (clubId: string) => void;
  isFavorite: (clubId: string) => boolean;
  setUserLocation: (location: { city: string; country: string; coordinates?: { latitude: number; longitude: number } }, showToast?: boolean) => void;
  addNewClub: (club: Omit<Club, 'id'>) => void;
  filterClubsByLocation: (city?: string, country?: string) => Club[];
  filterClubsByGenre: (genre?: string) => Club[];
  filterClubsByDistance: (maxDistance?: number) => Club[];
  getClubDistance: (clubId: string) => number | null;
};

const ClubsContext = createContext<ClubsContextType | undefined>(undefined);

export const ClubsProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [queueUpdates, setQueueUpdates] = useState<QueueUpdate[]>(initialUpdates);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteClubIds, setFavoriteClubIds] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteClubs');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [userLocation, setUserLocation] = useState<{ 
    city: string; 
    country: string; 
    coordinates?: { latitude: number; longitude: number } 
  } | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<Club[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('favoriteClubs', JSON.stringify(favoriteClubIds));
  }, [favoriteClubIds]);

  // Update nearbyClubs without triggering any toasts
  useEffect(() => {
    if (userLocation) {
      const filtered = clubs.filter(
        club => club.location.toLowerCase().includes(userLocation.city.toLowerCase())
      );
      setNearbyClubs(filtered);
    }
  }, [userLocation, clubs]);

  const getClub = (id: string) => {
    return clubs.find(club => club.id === id);
  };

  const getClubUpdates = (clubId: string) => {
    return queueUpdates
      .filter(update => update.clubId === clubId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const addQueueUpdate = (update: Omit<QueueUpdate, 'id' | 'timestamp'>) => {
    const newUpdate: QueueUpdate = {
      ...update,
      id: `update-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setQueueUpdates(prev => [newUpdate, ...prev]);

    setClubs(prev => 
      prev.map(club => {
        if (club.id === update.clubId) {
          const prevQueueLength = club.currentStatus.queueLength;
          
          return {
            ...club,
            currentStatus: {
              queueLength: update.queueLength,
              waitTime: update.waitTime,
              lastUpdated: newUpdate.timestamp,
              trend: 
                update.queueLength > prevQueueLength 
                  ? 'increasing' 
                  : update.queueLength < prevQueueLength 
                    ? 'decreasing' 
                    : 'stable',
            }
          };
        }
        return club;
      })
    );

    toast({
      title: "Update added!",
      description: "Thank you for contributing to the community.",
    });
  };

  const refreshClubs = () => {
    setIsLoading(true);
    setTimeout(() => {
      setClubs(prev => [...prev]);
      setIsLoading(false);
      
      toast({
        title: "Data refreshed",
        description: "Queue information is now up to date.",
      });
    }, 1000);
  };

  const toggleFavorite = (clubId: string) => {
    setFavoriteClubIds(prev => {
      if (prev.includes(clubId)) {
        const newFavorites = prev.filter(id => id !== clubId);
        toast({
          title: "Removed from favorites",
          description: "Club removed from your favorites list.",
        });
        return newFavorites;
      } else {
        const newFavorites = [...prev, clubId];
        toast({
          title: "Added to favorites",
          description: "Club added to your favorites list.",
        });
        return newFavorites;
      }
    });
  };

  const isFavorite = (clubId: string) => {
    return favoriteClubIds.includes(clubId);
  };

  const setLocationAndUpdateNearby = (location: { 
    city: string; 
    country: string; 
    coordinates?: { latitude: number; longitude: number } 
  }, showToast: boolean = false) => { // Change default to false to prevent any accidental toasts
    setUserLocation(location);
    if (showToast) {
      toast({
        title: "Location updated",
        description: `Showing clubs near ${location.city}, ${location.country}.`,
      });
    }
  };

  const addNewClub = (clubData: Omit<Club, 'id'>) => {
    const newClub: Club = {
      ...clubData,
      id: `club-${Date.now()}`,
    };

    setClubs(prev => [...prev, newClub]);
    toast({
      title: "Club added!",
      description: "Thank you for adding a new venue to our database.",
    });

    return newClub.id;
  };

  const filterClubsByLocation = (city?: string, country?: string) => {
    if (!city && !country) return clubs;
    
    return clubs.filter(club => {
      const locationLower = club.location.toLowerCase();
      const cityMatch = city ? locationLower.includes(city.toLowerCase()) : true;
      const countryMatch = country ? locationLower.includes(country.toLowerCase()) : true;
      return cityMatch && countryMatch;
    });
  };

  const filterClubsByGenre = (genre?: string) => {
    if (!genre) return clubs;
    
    return clubs.filter(club => 
      club.genres && club.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  };

  const filterClubsByDistance = (maxDistance?: number) => {
    if (!maxDistance || !userLocation?.coordinates) return clubs;
    
    return clubs.filter(club => {
      if (!club.coordinates) return false;
      
      const distance = LocationService.calculateDistance(
        userLocation.coordinates.latitude,
        userLocation.coordinates.longitude,
        club.coordinates.latitude,
        club.coordinates.longitude
      );
      
      return distance <= maxDistance;
    });
  };

  const getClubDistance = (clubId: string): number | null => {
    if (!userLocation?.coordinates) return null;
    
    const club = getClub(clubId);
    if (!club?.coordinates) return null;
    
    return LocationService.calculateDistance(
      userLocation.coordinates.latitude,
      userLocation.coordinates.longitude,
      club.coordinates.latitude,
      club.coordinates.longitude
    );
  };

  return (
    <ClubsContext.Provider
      value={{
        clubs,
        queueUpdates,
        isLoading,
        favoriteClubIds,
        nearbyClubs,
        userLocation,
        getClub,
        getClubUpdates,
        addQueueUpdate,
        refreshClubs,
        toggleFavorite,
        isFavorite,
        setUserLocation: setLocationAndUpdateNearby,
        addNewClub,
        filterClubsByLocation,
        filterClubsByGenre,
        filterClubsByDistance,
        getClubDistance,
      }}
    >
      {children}
    </ClubsContext.Provider>
  );
};

export const useClubs = () => {
  const context = useContext(ClubsContext);
  if (context === undefined) {
    throw new Error('useClubs must be used within a ClubsProvider');
  }
  return context;
};
