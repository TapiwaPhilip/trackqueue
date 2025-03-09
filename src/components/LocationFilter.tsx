
import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClubs } from '@/context/ClubsContext';
import { LocationService } from '@/services/LocationService';
import { useToast } from '@/components/ui/use-toast';

type LocationFilterProps = {
  onLocationChange: (city?: string, country?: string) => void;
};

const LocationFilter = ({ onLocationChange }: LocationFilterProps) => {
  const { userLocation, setUserLocation } = useClubs();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
  // Initialize with userLocation if it exists
  useEffect(() => {
    if (userLocation) {
      setCity(userLocation.city);
      setCountry(userLocation.country);
    }
  }, [userLocation]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() || country.trim()) {
      onLocationChange(city.trim() || undefined, country.trim() || undefined);
      toast({
        title: "Location filter applied",
        description: `Showing clubs in ${city || "any city"}${country ? `, ${country}` : ""}`,
      });
    } else {
      // If both fields are empty, clear the filter
      onLocationChange(undefined, undefined);
      toast({
        title: "Location filter cleared",
        description: "Showing clubs from all locations",
      });
    }
  };
  
  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const location = await LocationService.getUserLocation();
      if (location) {
        setCity(location.city);
        setCountry(location.country);
        setUserLocation(location);
        onLocationChange(location.city, location.country);
        toast({
          title: "Location detected",
          description: `Your location: ${location.city}, ${location.country}`,
        });
      } else {
        toast({
          title: "Location detection failed",
          description: "Please enter your location manually or try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location detection failed",
        description: "Please enter your location manually or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLocating(false);
    }
  };

  const handleClearLocation = () => {
    setCity('');
    setCountry('');
    onLocationChange(undefined, undefined);
    toast({
      title: "Location filter cleared",
      description: "Showing clubs from all locations",
    });
  };
  
  return (
    <div className="glass rounded-lg p-4 mb-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-nightGray border-nightStroke text-white"
            />
            <Input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-nightGray border-nightStroke text-white"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="gap-1 border-nightStroke hover:bg-nightPurple/20 flex-shrink-0"
            onClick={handleClearLocation}
            disabled={!city && !country}
          >
            Clear
          </Button>

          <Button type="submit" className="gap-1 bg-nightPurple hover:bg-nightPurple/80 flex-shrink-0">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="gap-1 border-nightStroke hover:bg-nightPurple/20 flex-shrink-0"
            onClick={handleDetectLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{isLocating ? 'Detecting...' : 'Detect location'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationFilter;
