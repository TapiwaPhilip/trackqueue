
import { Button } from '@/components/ui/button';

type ActiveFiltersBarProps = {
  activeFilters: {
    city?: string;
    country?: string;
    genre?: string;
    maxDistance?: number;
  };
  clearFilters: () => void;
};

const ActiveFiltersBar = ({ activeFilters, clearFilters }: ActiveFiltersBarProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(val => val !== undefined);
  
  if (!hasActiveFilters) return null;
  
  return (
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
          onClick={clearFilters}
        >
          Clear all
        </Button>
      </div>
    </div>
  );
};

export default ActiveFiltersBar;
