
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Clock, ArrowUp, ArrowDown, Minus, Heart } from 'lucide-react';
import type { Club } from '@/lib/mockData';
import { formatTimeAgo } from '@/lib/mockData';
import { useClubs } from '@/context/ClubsContext';

type ClubCardProps = {
  club: Club;
};

const ClubCard = ({ club }: ClubCardProps) => {
  const { id, name, location, image, currentStatus } = club;
  const { queueLength, waitTime, lastUpdated, trend } = currentStatus;
  const { toggleFavorite, isFavorite } = useClubs();
  
  const trendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <ArrowUp className="h-4 w-4 text-nightPink" />;
      case 'decreasing':
        return <ArrowDown className="h-4 w-4 text-nightGreen" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-nightBlue" />;
    }
  };
  
  const trendLabel = () => {
    switch (trend) {
      case 'increasing':
        return 'Growing';
      case 'decreasing':
        return 'Shrinking';
      case 'stable':
        return 'Stable';
    }
  };
  
  const trendColor = () => {
    switch (trend) {
      case 'increasing':
        return 'text-nightPink';
      case 'decreasing':
        return 'text-nightGreen';
      case 'stable':
        return 'text-nightBlue';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    toggleFavorite(id);
  };

  const isFav = isFavorite(id);

  return (
    <div className="relative group">
      <Link
        to={`/club/${id}`}
        className="block relative overflow-hidden rounded-xl bg-nightGray border border-nightStroke transition-all duration-300 hover:border-nightPurple hover:shadow-lg hover:shadow-nightPurple/10 hover:-translate-y-1"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nightShade to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-nightPurple transition-colors">{name}</h3>
            <p className="text-sm text-nightMuted">{location}</p>
          </div>
          <div className="absolute top-4 right-4 glass p-1.5 rounded-full text-sm font-medium flex items-center space-x-1">
            {trendIcon()}
            <span className={trendColor()}>{trendLabel()}</span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-nightMuted" />
              <span className="text-white font-medium">{queueLength} people</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-nightMuted" />
              <span className="text-white font-medium">{waitTime} min wait</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-nightMuted">
            <span>Updated {formatTimeAgo(lastUpdated)}</span>
            <span className="flex items-center group-hover:text-nightPurple transition-colors">
              View details <ArrowUpRight className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>
      </Link>
      
      {/* Favorite button positioned absolute on top of the card */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 left-4 glass p-2 rounded-full z-10 transition-all duration-300 transform hover:scale-110"
      >
        <Heart 
          className={`h-5 w-5 ${isFav ? 'text-nightPink fill-nightPink' : 'text-white'}`} 
        />
      </button>
    </div>
  );
};

export default ClubCard;
