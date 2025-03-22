
import { calculateDistance } from '@/utils/clubUtils';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationData = {
  city: string;
  country: string;
  coordinates?: Coordinates;
};

export class LocationService {
  static async getUserLocation(): Promise<LocationData | null> {
    try {
      // First try to get precise coordinates
      const coordinates = await this.getCoordinates();
      
      if (coordinates) {
        // Try to get city/country from coordinates using reverse geocoding
        try {
          const locationData = await this.reverseGeocode(coordinates);
          return locationData;
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          // Fall back to IP-based location
          return await this.getLocationFromIP();
        }
      } else {
        // Fall back to IP-based location if coordinates not available
        return await this.getLocationFromIP();
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      return null;
    }
  }

  private static getCoordinates(): Promise<Coordinates | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          resolve(null);
        },
        { timeout: 5000 }
      );
    });
  }

  private static async reverseGeocode(coordinates: Coordinates): Promise<LocationData | null> {
    try {
      // This would normally use a geocoding API like Google Maps, Mapbox, or OpenStreetMap
      // For this demo, we'll simulate it
      console.log('Would reverse geocode coordinates:', coordinates);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, return Berlin for all locations
      // In a real app, this would use the coordinates to get the actual city/country
      return {
        city: 'Berlin',
        country: 'Germany',
        coordinates
      };
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  }

  static async getLocationFromIP(): Promise<LocationData | null> {
    try {
      // This would normally use an IP geolocation API
      // For this demo, we'll simulate it
      console.log('Would get location from IP');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demo, return Berlin for all IP addresses
      // In a real app, this would use the IP to get the actual city/country
      return {
        city: 'Berlin',
        country: 'Germany'
      };
    } catch (error) {
      console.error('Error getting location from IP:', error);
      return null;
    }
  }

  // Reuse the calculateDistance utility function
  static calculateDistance = calculateDistance;
}
