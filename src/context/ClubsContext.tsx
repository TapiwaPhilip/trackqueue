
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { clubs as initialClubs, queueUpdates as initialUpdates } from '@/lib/mockData';
import type { Club, QueueUpdate } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

type ClubsContextType = {
  clubs: Club[];
  queueUpdates: QueueUpdate[];
  isLoading: boolean;
  getClub: (id: string) => Club | undefined;
  getClubUpdates: (clubId: string) => QueueUpdate[];
  addQueueUpdate: (update: Omit<QueueUpdate, 'id' | 'timestamp'>) => void;
  refreshClubs: () => void;
};

const ClubsContext = createContext<ClubsContextType | undefined>(undefined);

export const ClubsProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [queueUpdates, setQueueUpdates] = useState<QueueUpdate[]>(initialUpdates);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <ClubsContext.Provider
      value={{
        clubs,
        queueUpdates,
        isLoading,
        getClub,
        getClubUpdates,
        addQueueUpdate,
        refreshClubs,
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
