
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { QueueUpdate } from '@/lib/mockData';

export const useQueueUpdates = (initialUpdates: QueueUpdate[] = []) => {
  const [queueUpdates, setQueueUpdates] = useState<QueueUpdate[]>(initialUpdates);
  const { toast } = useToast();

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

    toast({
      title: "Update added!",
      description: "Thank you for contributing to the community.",
    });
    
    return newUpdate;
  };

  return {
    queueUpdates,
    getClubUpdates,
    addQueueUpdate
  };
};
