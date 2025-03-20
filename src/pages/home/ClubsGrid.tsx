
import ClubCard from '@/components/ClubCard';
import { Button } from '@/components/ui/button';
import type { Club } from '@/lib/mockData';

type ClubsGridProps = {
  clubs: Club[];
  onClearAllFilters: () => void;
};

const ClubsGrid = ({ clubs, onClearAllFilters }: ClubsGridProps) => {
  if (clubs.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-nightMuted">No clubs found matching your criteria</p>
        <Button 
          onClick={onClearAllFilters}
          className="mt-4 bg-nightPurple hover:bg-nightPurple/80"
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club, index) => (
        <div 
          key={club.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${(index + 2) * 0.1}s` }}
        >
          <ClubCard club={club} />
        </div>
      ))}
    </div>
  );
};

export default ClubsGrid;
