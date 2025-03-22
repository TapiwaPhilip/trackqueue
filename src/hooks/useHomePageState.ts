
import { useState, useEffect } from 'react';
import { useClubs } from '@/context/ClubsContext';
import type { Club } from '@/lib/mockData';

type UseHomePageStateProps = {
  clubs: Club[];
  favoriteClubIds: string[];
  nearbyClubs: Club[];
};

export const useHomePageState = ({ 
  clubs, 
  favoriteClubIds, 
  nearbyClubs 
}: UseHomePageStateProps) => {
  const { 
    filterClubsByLocation, 
    filterClubsByGenre,
    filterClubsByDistance,
  } = useClubs();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  const [displayMode, setDisplayMode] = useState<'all' | 'favorites' | 'nearby'>('all');
  const [activeFilters, setActiveFilters] = useState<{
    city?: string;
    country?: string;
    genre?: string;
    maxDistance?: number;
  }>({});
  
  // Update filtered clubs when search query or filters change
  useEffect(() => {
    let clubsToFilter = clubs;
    
    // Base set of clubs based on display mode
    switch (displayMode) {
      case 'favorites':
        clubsToFilter = clubs.filter(club => favoriteClubIds.includes(club.id));
        break;
      case 'nearby':
        clubsToFilter = nearbyClubs;
        break;
    }
    
    // Apply location filter
    if (activeFilters.city || activeFilters.country) {
      clubsToFilter = filterClubsByLocation(activeFilters.city, activeFilters.country);
    }
    
    // Apply genre filter
    if (activeFilters.genre) {
      clubsToFilter = filterClubsByGenre(activeFilters.genre);
    }
    
    // Apply distance filter
    if (activeFilters.maxDistance !== undefined) {
      clubsToFilter = filterClubsByDistance(activeFilters.maxDistance);
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      clubsToFilter = clubsToFilter.filter(
        (club) =>
          club.name.toLowerCase().includes(query) ||
          club.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredClubs(clubsToFilter);
  }, [
    searchQuery, 
    clubs, 
    displayMode, 
    favoriteClubIds, 
    nearbyClubs, 
    activeFilters,
    filterClubsByLocation,
    filterClubsByGenre,
    filterClubsByDistance
  ]);
  
  const handleLocationChange = (city?: string, country?: string) => {
    // Update the active filters
    setActiveFilters(prev => ({
      ...prev,
      city,
      country
    }));
    
    // If no location is specified, ensure we're not in a filtered mode
    if (!city && !country) {
      setActiveFilters(prev => ({
        ...prev,
        city: undefined,
        country: undefined
      }));
    }
  };
  
  const handleAdvancedFiltersChange = (filters: {
    city?: string;
    country?: string;
    genre?: string;
    maxDistance?: number;
  }) => {
    setActiveFilters(filters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setDisplayMode('all');
  };
  
  return {
    searchQuery,
    setSearchQuery,
    displayMode,
    setDisplayMode,
    activeFilters,
    setActiveFilters,
    filteredClubs,
    handleLocationChange,
    handleAdvancedFiltersChange,
    clearAllFilters
  };
};
