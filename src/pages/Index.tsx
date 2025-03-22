
import { useState, useEffect } from 'react';
import { useClubs } from '@/context/ClubsContext';
import { useAuth } from '@/context/AuthContext';
import { LocationService } from '@/services/LocationService';
import Navbar from '@/components/Navbar';
import LocationFilter from '@/components/LocationFilter';

// Import our new components
import PageHeader from './home/PageHeader';
import DisplayModeTabs from './home/DisplayModeTabs';
import ActionBar from './home/ActionBar';
import ActiveFiltersBar from './home/ActiveFiltersBar';
import SearchBar from './home/SearchBar';
import EmptyStateMessage from './home/EmptyStateMessage';
import ClubsGrid from './home/ClubsGrid';
import Footer from './home/Footer';

const Index = () => {
  const { 
    clubs, 
    favoriteClubIds, 
    filterClubsByLocation, 
    filterClubsByGenre,
    filterClubsByDistance,
    nearbyClubs, 
    setUserLocation 
  } = useClubs();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  const [displayMode, setDisplayMode] = useState<'all' | 'favorites' | 'nearby'>('all');
  const [activeFilters, setActiveFilters] = useState<{
    city?: string;
    country?: string;
    genre?: string;
    maxDistance?: number;
  }>({});
  
  // Try to get user location on mount WITHOUT showing toast
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await LocationService.getUserLocation();
        if (location) {
          // Pass false to prevent toast notification
          setUserLocation(location, false);
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };
    
    getLocation();
  }, [setUserLocation]);
  
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
  
  const favoriteClubs = clubs.filter(club => favoriteClubIds.includes(club.id));
  const hasFavorites = favoriteClubs.length > 0;
  const hasNearby = nearbyClubs.length > 0;

  return (
    <div className="min-h-screen bg-nightShade">
      <Navbar />
      
      <main className="container px-4 mx-auto pt-8 pb-20">
        <PageHeader 
          title="Real-time Nightclub Queue Tracker"
          description="Get live updates on queue lengths and wait times at your favorite nightclubs, updated by the community, for the community."
        />
        
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <DisplayModeTabs 
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            hasFavorites={hasFavorites}
            hasNearby={hasNearby}
          />
          
          <ActionBar onFiltersChange={handleAdvancedFiltersChange} />
        </div>
        
        <LocationFilter onLocationChange={handleLocationChange} />
        
        <ActiveFiltersBar 
          activeFilters={activeFilters} 
          clearFilters={() => setActiveFilters({})} 
        />
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {displayMode === 'favorites' && !hasFavorites && (
          <EmptyStateMessage type="favorites" onShowAllClubs={() => setDisplayMode('all')} />
        )}
        
        {displayMode === 'nearby' && !hasNearby && (
          <EmptyStateMessage type="nearby" onShowAllClubs={() => setDisplayMode('all')} />
        )}
        
        <ClubsGrid clubs={filteredClubs} onClearAllFilters={clearAllFilters} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
