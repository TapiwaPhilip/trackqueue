
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClubs } from '@/context/ClubsContext';
import { useAuth } from '@/context/AuthContext';
import { LocationService } from '@/services/LocationService';
import { Search, PlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClubCard from '@/components/ClubCard';
import LocationFilter from '@/components/LocationFilter';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';

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
  
  // Try to get user location on mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await LocationService.getUserLocation();
        if (location) {
          setUserLocation(location);
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };
    
    getLocation();
  }, [setUserLocation]);
  
  // Update filtered clubs when search query or filters change
  useEffect(() => {
    let clubsToFilter: typeof clubs;
    
    // Base set of clubs based on display mode
    switch (displayMode) {
      case 'favorites':
        clubsToFilter = clubs.filter(club => favoriteClubIds.includes(club.id));
        break;
      case 'nearby':
        clubsToFilter = nearbyClubs;
        break;
      default:
        clubsToFilter = clubs;
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
  
  const favoriteClubs = clubs.filter(club => favoriteClubIds.includes(club.id));
  const hasFavorites = favoriteClubs.length > 0;
  
  // Determine if we have active filters
  const hasActiveFilters = Object.values(activeFilters).some(val => val !== undefined);

  return (
    <div className="min-h-screen bg-nightShade">
      <Navbar />
      
      <main className="container px-4 mx-auto pt-8 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real-time Nightclub Queue Tracker
          </h1>
          <p className="text-nightMuted">
            Get live updates on queue lengths and wait times at your favorite nightclubs, 
            updated by the community, for the community.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={displayMode === 'all' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('all')}
              className={displayMode === 'all' ? 'bg-nightPurple' : 'border-nightStroke'}
            >
              All Clubs
            </Button>
            
            <Button
              variant={displayMode === 'favorites' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('favorites')}
              className={displayMode === 'favorites' ? 'bg-nightPurple' : 'border-nightStroke'}
              disabled={!hasFavorites}
            >
              My Favorites
            </Button>
            
            <Button
              variant={displayMode === 'nearby' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('nearby')}
              className={displayMode === 'nearby' ? 'bg-nightPurple' : 'border-nightStroke'}
              disabled={nearbyClubs.length === 0}
            >
              Nearby
            </Button>
          </div>
          
          <div className="flex gap-2 items-center">
            <FilterPanel onFiltersChange={handleAdvancedFiltersChange} />
            
            <Link to="/add-club">
              <Button variant="outline" className="border-nightStroke">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Club
              </Button>
            </Link>
          </div>
        </div>
        
        <LocationFilter onLocationChange={handleLocationChange} />
        
        {hasActiveFilters && (
          <div className="mb-4 p-3 bg-nightGray/50 rounded-lg border border-nightStroke">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-nightMuted">Active filters:</span>
              
              {activeFilters.city && (
                <div className="bg-nightPurple/20 border border-nightPurple/30 text-xs rounded-full px-2 py-1">
                  City: {activeFilters.city}
                </div>
              )}
              
              {activeFilters.country && (
                <div className="bg-nightPurple/20 border border-nightPurple/30 text-xs rounded-full px-2 py-1">
                  Country: {activeFilters.country}
                </div>
              )}
              
              {activeFilters.genre && (
                <div className="bg-nightPurple/20 border border-nightPurple/30 text-xs rounded-full px-2 py-1">
                  Genre: {activeFilters.genre}
                </div>
              )}
              
              {activeFilters.maxDistance !== undefined && (
                <div className="bg-nightPurple/20 border border-nightPurple/30 text-xs rounded-full px-2 py-1">
                  Distance: ≤{activeFilters.maxDistance}km
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-nightMuted hover:text-white ml-auto"
                onClick={() => setActiveFilters({})}
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative max-w-md mx-auto mb-12 animate-fade-in animate-delay-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for clubs..."
              className="w-full bg-nightGray border border-nightStroke rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-nightPurple"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-nightMuted" />
          </div>
        </div>
        
        {displayMode === 'favorites' && !hasFavorites && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-nightMuted mb-4">You haven't added any clubs to your favorites yet.</p>
            <Button 
              onClick={() => setDisplayMode('all')}
              className="bg-nightPurple hover:bg-nightPurple/80"
            >
              Browse All Clubs
            </Button>
          </div>
        )}
        
        {displayMode === 'nearby' && nearbyClubs.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-nightMuted mb-4">No clubs found in your area.</p>
            <Button 
              onClick={() => setDisplayMode('all')}
              className="bg-nightPurple hover:bg-nightPurple/80"
            >
              Browse All Clubs
            </Button>
          </div>
        )}
        
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, index) => (
              <div 
                key={club.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <ClubCard club={club} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-nightMuted">No clubs found matching your criteria</p>
            <Button 
              onClick={() => {
                setActiveFilters({});
                setSearchQuery('');
                setDisplayMode('all');
              }}
              className="mt-4 bg-nightPurple hover:bg-nightPurple/80"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
      
      <footer className="py-8 border-t border-nightStroke">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-nightMuted">
            © {new Date().getFullYear()} QTracker - Real-time nightclub queue tracking
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
