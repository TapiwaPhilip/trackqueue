
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useFavorites = () => {
  const [favoriteClubIds, setFavoriteClubIds] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteClubs');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('favoriteClubs', JSON.stringify(favoriteClubIds));
  }, [favoriteClubIds]);

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

  return {
    favoriteClubIds,
    toggleFavorite,
    isFavorite
  };
};
