
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClubs } from '@/context/ClubsContext';
import { useAuth } from '@/context/AuthContext';
import { LocationService } from '@/services/LocationService';
import { Search, PlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClubCard from '@/components/ClubCard';
import LocationFilter from '@/components/LocationFilter';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { clubs, favoriteClubIds, filterClubsByLocation, nearbyClubs, setUserLocation } = useClubs();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  const [displayMode, setDisplayMode] = useState<'all' | 'favorites' | 'nearby'>('all');
  
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
  
  // Update filtered clubs when search query changes
  useEffect(() => {
    let clubsToFilter: typeof clubs;
    
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
    
    if (searchQuery.trim() === '') {
      setFilteredClubs(clubsToFilter);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClubs(
        clubsToFilter.filter(
          (club) =>
            club.name.toLowerCase().includes(query) ||
            club.location.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clubs, displayMode, favoriteClubIds, nearbyClubs]);
  
  const handleLocationChange = (city?: string, country?: string) => {
    // If no location is specified, show all clubs
    if (!city && !country) {
      setDisplayMode('all');
      setFilteredClubs(clubs);
      return;
    }
    
    // Filter clubs by location
    const filteredByLocation = filterClubsByLocation(city, country);
    setFilteredClubs(filteredByLocation);
    setDisplayMode('all'); // Reset to "all" mode but with location filter applied
  };
  
  const favoriteClubs = clubs.filter(club => favoriteClubIds.includes(club.id));
  const hasFavorites = favoriteClubs.length > 0;

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
        
        <div className="flex justify-between items-center mb-6">
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
          
          <Link to="/add-club">
            <Button variant="outline" className="border-nightStroke">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Club
            </Button>
          </Link>
        </div>
        
        <LocationFilter onLocationChange={handleLocationChange} />
        
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
            <p className="text-nightMuted">No clubs found matching "{searchQuery}"</p>
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
