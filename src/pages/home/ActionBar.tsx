
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterPanel from '@/components/FilterPanel';

type ActionBarProps = {
  onFiltersChange: (filters: {
    city?: string;
    country?: string;
    genre?: string;
    maxDistance?: number;
  }) => void;
};

const ActionBar = ({ onFiltersChange }: ActionBarProps) => {
  return (
    <div className="flex gap-2 items-center">
      <FilterPanel onFiltersChange={onFiltersChange} />
      
      <Link to="/add-club">
        <Button variant="outline" className="border-nightStroke">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Club
        </Button>
      </Link>
    </div>
  );
};

export default ActionBar;
