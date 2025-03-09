
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '@/context/ClubsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const AddClubForm = () => {
  const { addNewClub } = useClubs();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
    latitude: '',
    longitude: '',
    genres: '',
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!formData.name.trim()) {
      setFormError('Club name is required');
      return;
    }
    
    if (!formData.location.trim()) {
      setFormError('Location is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse coordinates if provided
      const coordinates = formData.latitude && formData.longitude ? {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      } : undefined;
      
      // Parse genres
      const genres = formData.genres ? 
        formData.genres.split(',').map(genre => genre.trim()) : 
        undefined;
      
      // Prepare the club data with default values
      const newClubData = {
        name: formData.name,
        location: formData.location,
        description: formData.description || `A nightclub located in ${formData.location}`,
        image: formData.image || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1170',
        currentStatus: {
          queueLength: 0,
          waitTime: 0,
          lastUpdated: new Date().toISOString(),
          trend: 'stable' as const
        },
        coordinates,
        genres
      };
      
      // Add the club
      const newClubId = addNewClub(newClubData);
      
      toast({
        title: 'Success!',
        description: `${formData.name} has been added to our database.`
      });
      
      // Navigate to the club detail page
      navigate(`/club/${newClubId}`);
    } catch (error) {
      console.error('Error adding club:', error);
      setFormError('Failed to add club. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in glass rounded-xl p-6 shadow-xl shadow-black/20">
      <h2 className="text-xl font-bold text-white mb-6">Add a New Club</h2>
      
      {formError && (
        <div className="mb-4 p-3 bg-nightPink/20 border border-nightPink rounded-md text-white">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-nightMuted mb-1">
            Club Name*
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Berghain"
            className="bg-nightGray border-nightStroke"
            required
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-nightMuted mb-1">
            Location* (City, Country)
          </label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Berlin, Germany"
            className="bg-nightGray border-nightStroke"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-nightMuted mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about this club..."
            className="bg-nightGray border-nightStroke min-h-[100px]"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-nightMuted mb-1">
            Image URL (optional)
          </label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="bg-nightGray border-nightStroke"
          />
          <p className="text-xs text-nightMuted mt-1">
            Leave empty to use a default image
          </p>
        </div>
        
        <div>
          <label htmlFor="genres" className="block text-sm font-medium text-nightMuted mb-1">
            Music Genres (optional, comma-separated)
          </label>
          <Input
            id="genres"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            placeholder="Techno, House, Electronic"
            className="bg-nightGray border-nightStroke"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-nightMuted mb-1">
              Latitude (optional)
            </label>
            <Input
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="52.5200"
              className="bg-nightGray border-nightStroke"
              type="number"
              step="any"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-nightMuted mb-1">
              Longitude (optional)
            </label>
            <Input
              id="longitude"
              name="longitude"
              onChange={handleChange}
              value={formData.longitude}
              placeholder="13.4050"
              className="bg-nightGray border-nightStroke"
              type="number"
              step="any"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-nightPurple hover:bg-nightPurple/80 transition-colors"
        >
          {isSubmitting ? 'Adding Club...' : 'Add Club'}
        </Button>
      </form>
    </div>
  );
};

export default AddClubForm;
