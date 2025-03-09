
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { clubs as initialClubs, queueUpdates as initialUpdates } from '@/lib/mockData';
import type { Club, QueueUpdate } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

type ClubsContextType = {
  clubs: Club[];
  queueUpdates: QueueUpdate[];
  isLoading: boolean;
  favoriteClubIds: string[];
  nearbyClubs: Club[];
  userLocation: { city: string; country: string } | null;
  getClub: (id: string) => Club | undefined;
  getClubUpdates: (clubId: string) => QueueUpdate[];
  addQueueUpdate: (update: Omit<QueueUpdate, 'id' | 'timestamp'>) => void;
  refreshClubs: () => void;
  toggleFavorite: (clubId: string) => void;
  isFavorite: (clubId: string) => boolean;
  setUserLocation: (location: { city: string; country: string }) => void;
  addNewClub: (club: Omit<Club, 'id'>) => void;
  filterClubsByLocation: (city?: string, country?: string) => Club[];
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
  const [userLocation, setUserLocation] = useState<{ city: string; country: string } | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<Club[]>([]);
  const { toast } = useToast();

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteClubs', JSON.stringify(favoriteClubIds));
  }, [favoriteClubIds]);

  // Update nearby clubs whenever userLocation or clubs change
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

    // Update the club's current status
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
    // Simulate refresh from server
    setTimeout(() => {
      setClubs(prev => [...prev]); // In a real app, this would be a fetch
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

  const setLocationAndUpdateNearby = (location: { city: string; country: string }) => {
    setUserLocation(location);
    toast({
      title: "Location updated",
      description: `Showing clubs near ${location.city}, ${location.country}.`,
    });
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
