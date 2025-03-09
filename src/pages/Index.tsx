
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ClubCard from '@/components/ClubCard';
import { useClubs } from '@/context/ClubsContext';
import { Search } from 'lucide-react';

const Index = () => {
  const { clubs } = useClubs();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubs);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClubs(clubs);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClubs(
        clubs.filter(
          (club) =>
            club.name.toLowerCase().includes(query) ||
            club.location.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clubs]);

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
