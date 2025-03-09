
import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useClubs } from '@/context/ClubsContext';

// Common music genres for nightclubs
const COMMON_GENRES = [
  'Techno',
  'House',
  'EDM',
  'Hip Hop',
  'R&B',
  'Disco',
  'Pop',
  'Latin',
  'Reggaeton',
  'Dubstep'
];

type FilterPanelProps = {
  onFiltersChange: (filters: {
    city?: string;
    country?: string;
    genre?: string;
    maxDistance?: number;
  }) => void;
};

const FilterPanel = ({ onFiltersChange }: FilterPanelProps) => {
  const { userLocation } = useClubs();
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [hasLocationCoordinates, setHasLocationCoordinates] = useState(false);
  
  // Initialize with userLocation if it exists
  useEffect(() => {
    if (userLocation) {
      setCity(userLocation.city || '');
      setCountry(userLocation.country || '');
      setHasLocationCoordinates(!!userLocation.coordinates);
    }
  }, [userLocation]);
  
  const handleApplyFilters = () => {
    onFiltersChange({
      city: city || undefined,
      country: country || undefined,
      genre: selectedGenre,
      maxDistance: hasLocationCoordinates ? maxDistance : undefined
    });
    setIsOpen(false);
  };
  
  const handleClearFilters = () => {
    setCity('');
    setCountry('');
    setSelectedGenre(undefined);
    setMaxDistance(10);
    onFiltersChange({});
  };
  
  // Update city/country when userLocation changes
  useEffect(() => {
    if (userLocation) {
      setCity(userLocation.city || '');
      setCountry(userLocation.country || '');
      setHasLocationCoordinates(!!userLocation.coordinates);
    }
  }, [userLocation]);
  
  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border-nightStroke"
      >
        <Filter className="h-4 w-4" />
        Advanced Filters
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-nightGray border-nightStroke text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Advanced Filters</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Location</h3>
              <div className="flex gap-2">
                <Input
                  className="bg-nightShade border-nightStroke"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  className="bg-nightShade border-nightStroke"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Music Genre</h3>
              <div className="flex flex-wrap gap-2">
                {COMMON_GENRES.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    className={selectedGenre === genre 
                      ? "bg-nightPurple hover:bg-nightPurple/80" 
                      : "border-nightStroke hover:bg-nightPurple/20"}
                    onClick={() => setSelectedGenre(selectedGenre === genre ? undefined : genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
            
            {hasLocationCoordinates && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Maximum Distance</h3>
                  <span className="text-sm text-nightMuted">{maxDistance} km</span>
                </div>
                <Slider
                  value={[maxDistance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(values) => setMaxDistance(values[0])}
                  className="py-4"
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              className="border-nightStroke hover:bg-nightPurple/20"
              onClick={handleClearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="border-nightStroke">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-nightPurple hover:bg-nightPurple/80"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterPanel;
