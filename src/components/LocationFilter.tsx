
import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClubs } from '@/context/ClubsContext';
import { LocationService } from '@/services/LocationService';

type LocationFilterProps = {
  onLocationChange: (city?: string, country?: string) => void;
};

const LocationFilter = ({ onLocationChange }: LocationFilterProps) => {
  const { userLocation, setUserLocation } = useClubs();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  // Initialize with userLocation if it exists
  useEffect(() => {
    if (userLocation) {
      setCity(userLocation.city);
      setCountry(userLocation.country);
    }
  }, [userLocation]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationChange(city, country);
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
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLocating(false);
    }
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
              className="bg-nightGray border-nightStroke"
            />
            <Input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-nightGray border-nightStroke"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" className="gap-1 bg-nightPurple hover:bg-nightPurple/80">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="gap-1 border-nightStroke hover:bg-nightPurple/20"
            onClick={handleDetectLocation}
            disabled={isLocating}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{isLocating ? 'Detecting...' : 'Detect location'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationFilter;
