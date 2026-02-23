import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LocationCoords } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<LocationCoords> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      };
    } catch (err) {
      console.error('Error getting location:', err);
      throw err;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
      } catch (err) {
        console.error('Failed to get location, using default:', err);
        setLocation({
          latitude: 42.3601,
          longitude: -71.0589,
        });
        setError('Using default location (Boston)');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  const refreshLocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
    } catch (err) {
      console.error('Failed to refresh location:', err);
      setError('Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    isLoading,
    error,
    refreshLocation,
    requestLocationPermission,
  };
};
