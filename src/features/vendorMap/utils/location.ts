import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

// Request location permission
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
    // iOS: triggers permission prompt if not granted
    Geolocation.requestAuthorization(); // returns void
    return true; // Assume handled by system
  }
};

export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  const tryGetLocation = (
    enableHighAccuracy: boolean,
    timeout: number,
    maximumAge: number
  ): Promise<LocationCoords | null> => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location fetched:', position);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude ?? undefined,
            heading: position.coords.heading ?? undefined,
            speed: position.coords.speed ?? undefined,
          });
        },
        (error) => {
          console.warn('⚠️ Location error:', error);
          resolve(null); // Don't show alert yet — we'll retry first
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    });
  };

  let location = await tryGetLocation(true, 7000, 10000); // 1st try high accuracy, fresh
  if (!location) {
    console.warn('🔁 Retrying with fallback (low accuracy, cached)');
    location = await tryGetLocation(false, 6000, 20000); // fallback: relaxed
  }

  if (!location) {
    Alert.alert(
      'Location Unavailable',
      'Could not fetch your current location after multiple attempts. Please check your GPS or move to an open area.'
    );
  }

  return location;
};


// Watch location continuously (not used unless tracking)
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
      distanceFilter: 10,
      interval: 5000,
      fastestInterval: 2000,
    }
  );
};

export const clearLocationWatch = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Quick check if location is enabled (best effort)
export const isLocationEnabled = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => {
        resolve(error.code !== 2); // false only if POSITION_UNAVAILABLE
      },
      { timeout: 1000, maximumAge: 0 }
    );
  });
};
