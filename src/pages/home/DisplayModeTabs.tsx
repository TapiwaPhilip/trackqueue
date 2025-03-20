
import { Button } from '@/components/ui/button';

type DisplayModeTabsProps = {
  displayMode: 'all' | 'favorites' | 'nearby';
  setDisplayMode: (mode: 'all' | 'favorites' | 'nearby') => void;
  hasFavorites: boolean;
  hasNearby: boolean;
};

const DisplayModeTabs = ({ 
  displayMode, 
  setDisplayMode, 
  hasFavorites, 
  hasNearby 
}: DisplayModeTabsProps) => {
  return (
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
        disabled={!hasNearby}
      >
        Nearby
      </Button>
    </div>
  );
};

export default DisplayModeTabs;
