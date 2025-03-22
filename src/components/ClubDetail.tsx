
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, ArrowUp, ArrowDown, Minus, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import UpdatesList from '@/components/UpdatesList';
import QueueUpdate from '@/components/QueueUpdate';
import SocialShare from '@/components/SocialShare';
import { useClubs } from '@/context/ClubsContext';
import { formatTimeAgo } from '@/lib/mockData';

const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getClub, getClubUpdates, toggleFavorite, isFavorite } = useClubs();
  const [isLoading, setIsLoading] = useState(true);
  
  const club = getClub(id || '');
  const updates = getClubUpdates(id || '');
  const isFav = id ? isFavorite(id) : false;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-nightShade">
        <Navbar />
        <div className="container px-4 mx-auto flex items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-nightPurple animate-pulse-gentle">Loading club details...</div>
        </div>
      </div>
    );
  }
  
  if (!club) {
    return (
      <div className="min-h-screen bg-nightShade">
        <Navbar />
        <div className="container px-4 mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Club Not Found</h2>
          <p className="text-nightMuted mb-8">The club you're looking for doesn't exist.</p>
          <Link to="/" className="text-nightPurple hover:underline">
            &larr; Back to all clubs
          </Link>
        </div>
      </div>
    );
  }
  
  const { name, location, image, description, currentStatus } = club;
  const { queueLength, waitTime, lastUpdated, trend } = currentStatus;
  
  const renderTrendIndicator = () => {
    switch (trend) {
      case 'increasing':
        return (
          <div className="glass rounded-lg px-3 py-2 inline-flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-nightPink mr-1.5" />
            <span className="text-white">Queue growing</span>
          </div>
        );
      case 'decreasing':
        return (
          <div className="glass rounded-lg px-3 py-2 inline-flex items-center text-sm">
            <ArrowDown className="h-4 w-4 text-nightGreen mr-1.5" />
            <span className="text-white">Queue shrinking</span>
          </div>
        );
      case 'stable':
        return (
          <div className="glass rounded-lg px-3 py-2 inline-flex items-center text-sm">
            <Minus className="h-4 w-4 text-nightBlue mr-1.5" />
            <span className="text-white">Queue stable</span>
          </div>
        );
    }
  };

  const handleFavoriteToggle = () => {
    if (id) {
      toggleFavorite(id);
    }
  };

  return (
    <div className="min-h-screen bg-nightShade">
      <Navbar />
      
      <div className="relative h-64 md:h-80">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a default image if the club image fails to load
            e.currentTarget.src = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nightShade to-transparent" />
        
        <div className="absolute top-4 left-4 flex space-x-2">
          <Link 
            to="/" 
            className="glass rounded-full p-2 inline-block hover:border-nightPurple transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          
          <button 
            onClick={handleFavoriteToggle}
            className="glass rounded-full p-2 inline-block hover:border-nightPurple transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isFav ? 'text-nightPink fill-nightPink' : 'text-white'}`} 
            />
          </button>
        </div>
      </div>
      
      <main className="container px-4 mx-auto -mt-20 relative z-10 pb-20">
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in shadow-xl shadow-black/20">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{name}</h1>
              <p className="text-nightMuted mb-4">{location}</p>
              <p className="text-white/80 mb-6">{description}</p>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {renderTrendIndicator()}
                
                <div className="glass rounded-lg px-3 py-2 inline-flex items-center text-sm">
                  <Users className="h-4 w-4 text-nightMuted mr-1.5" />
                  <span className="text-white">{queueLength} people</span>
                </div>
                
                <div className="glass rounded-lg px-3 py-2 inline-flex items-center text-sm">
                  <Clock className="h-4 w-4 text-nightMuted mr-1.5" />
                  <span className="text-white">{waitTime} min wait</span>
                </div>
              </div>
              
              <p className="text-sm text-nightMuted">
                Last updated {formatTimeAgo(lastUpdated)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <SocialShare 
                clubName={name} 
                queueLength={queueLength} 
                waitTime={waitTime} 
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-fade-in animate-delay-1">
            <h2 className="text-xl font-bold text-white mb-4">Recent Updates</h2>
            <UpdatesList updates={updates} />
          </div>
          
          <div className="animate-fade-in animate-delay-2">
            <h2 className="text-xl font-bold text-white mb-4">Add Your Update</h2>
            <QueueUpdate clubId={id || ''} />
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-nightStroke">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-nightMuted">
            © {new Date().getFullYear()} TrackQueue - Real-time nightclub queue tracking
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClubDetail;
