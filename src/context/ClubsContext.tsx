
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { clubs as initialClubs, queueUpdates as initialUpdates } from '@/lib/mockData';
import type { Club, QueueUpdate } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useQueueUpdates } from '@/hooks/useQueueUpdates';
import { 
  filterClubsByLocation, 
  filterClubsByGenre, 
  filterClubsByDistance,
  getClubDistance
} from '@/utils/clubUtils';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Use our custom hooks
  const { favoriteClubIds, toggleFavorite, isFavorite } = useFavorites();
  const { userLocation, setUserLocation, nearbyClubs, updateNearbyClubs } = useUserLocation();
  const { queueUpdates, getClubUpdates, addQueueUpdate: addUpdate } = useQueueUpdates(initialUpdates);

  // Update nearbyClubs when clubs or userLocation changes
  useEffect(() => {
    updateNearbyClubs(clubs);
  }, [clubs, userLocation]);

  const getClub = (id: string) => {
    return clubs.find(club => club.id === id);
  };

  const addQueueUpdate = (update: Omit<QueueUpdate, 'id' | 'timestamp'>) => {
    const newUpdate = addUpdate(update);

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

  // Use the utility functions with our local state
  const filterClubsByLocationWrapper = (city?: string, country?: string) => {
    return filterClubsByLocation(clubs, city, country);
  };

  const filterClubsByGenreWrapper = (genre?: string) => {
    return filterClubsByGenre(clubs, genre);
  };

  const filterClubsByDistanceWrapper = (maxDistance?: number) => {
    return filterClubsByDistance(clubs, maxDistance, userLocation?.coordinates);
  };

  const getClubDistanceWrapper = (clubId: string): number | null => {
    if (!userLocation?.coordinates) return null;
    const club = getClub(clubId);
    if (!club) return null;
    return getClubDistance(club, userLocation.coordinates);
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
        setUserLocation,
        addNewClub,
        filterClubsByLocation: filterClubsByLocationWrapper,
        filterClubsByGenre: filterClubsByGenreWrapper,
        filterClubsByDistance: filterClubsByDistanceWrapper,
        getClubDistance: getClubDistanceWrapper,
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
