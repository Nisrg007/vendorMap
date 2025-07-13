// utils/location.ts
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show nearby vendors.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  } else {
    // iOS - request authorization
    return new Promise((resolve) => {
      Geolocation.requestAuthorization('whenInUse').then((result) => {
        resolve(result === 'granted');
      }).catch(() => {
        resolve(false);
      });
    });
  }
};

export const getCurrentLocation = (): Promise<LocationCoords | null> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
        });
      },
      (error) => {
        console.error('Location error:', error);
        
        // Handle different error types
        switch (error.code) {
          case 1:
            Alert.alert(
              'Location Permission Denied',
              'Please enable location permissions in settings to find nearby vendors.'
            );
            break;
          case 2:
            Alert.alert(
              'Location Unavailable',
              'Your location is currently unavailable. Please check your GPS settings.'
            );
            break;
          case 3:
            Alert.alert(
              'Location Timeout',
              'Getting your location is taking too long. Please try again.'
            );
            break;
          default:
            Alert.alert(
              'Location Error',
              'Unable to get your current location. Please try again.'
            );
        }
        
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: true,
        forceRequestLocation: true,
      }
    );
  });
};

export const watchUserLocation = (
  onLocationChange: (location: LocationCoords) => void,
  onError?: (error: any) => void
): number => {
  return Geolocation.watchPosition(
    (position) => {
      onLocationChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
      });
    },
    (error) => {
      console.error('Location watch error:', error);
      onError?.(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 10, // Only update if user moves 10 meters
      interval: 5000, // Update every 5 seconds
      fastestInterval: 2000, // Fastest update interval
    }
  );
};

export const clearLocationWatch = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Check if location services are enabled
export const isLocationEnabled = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => resolve(error.code !== 2), // POSITION_UNAVAILABLE
      { timeout: 1000, maximumAge: 0 }
    );
  });
};