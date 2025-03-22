
import { useState, useEffect } from 'react';
import { useClubs } from '@/context/ClubsContext';
import { useAuth } from '@/context/AuthContext';
import { LocationService } from '@/services/LocationService';
import Navbar from '@/components/Navbar';
import LocationFilter from '@/components/LocationFilter';

// Import our components
import PageHeader from './home/PageHeader';
import DisplayModeTabs from './home/DisplayModeTabs';
import ActionBar from './home/ActionBar';
import ActiveFiltersBar from './home/ActiveFiltersBar';
import SearchBar from './home/SearchBar';
import EmptyStateMessage from './home/EmptyStateMessage';
import ClubsGrid from './home/ClubsGrid';
import Footer from './home/Footer';
import { useHomePageState } from '@/hooks/useHomePageState';

const Index = () => {
  const { 
    clubs, 
    favoriteClubIds,
    nearbyClubs, 
    setUserLocation 
  } = useClubs();
  const { isAuthenticated } = useAuth();
  
  const {
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
  } = useHomePageState({ clubs, favoriteClubIds, nearbyClubs });
  
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
  
  const hasFavorites = clubs.filter(club => favoriteClubIds.includes(club.id)).length > 0;
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
