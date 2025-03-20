
import { Button } from '@/components/ui/button';

type EmptyStateMessageProps = {
  type: 'favorites' | 'nearby';
  onShowAllClubs: () => void;
};

const EmptyStateMessage = ({ type, onShowAllClubs }: EmptyStateMessageProps) => {
  return (
    <div className="text-center py-12 animate-fade-in">
      <p className="text-nightMuted mb-4">
        {type === 'favorites' 
          ? "You haven't added any clubs to your favorites yet." 
          : "No clubs found in your area."}
      </p>
      <Button 
        onClick={onShowAllClubs}
        className="bg-nightPurple hover:bg-nightPurple/80"
      >
        Browse All Clubs
      </Button>
    </div>
  );
};

export default EmptyStateMessage;
