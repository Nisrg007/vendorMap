import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/UI/SearchBar';
import FilterModal from '../components/UI/FilterModal';
import CustomVendorMarker from '../components/Map/CustomVendorMarker';
import UserLocationMarker from '../components/Map/UserLocationMarker';
import BottomSheetTabs from '../components/UI/BottomSheetTabs';
import { useData } from '../services/DataProvider';
import { Vendor } from '../../../types/vendor';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { requestLocationPermission, getCurrentLocation } from '../utils/location';
import { useClustering } from '../components/Map/useClustering';
import ClusterMarker from '../components/Map/ClusterMarker';
import ClusterModal from '../components/Map/ClusterModal';

const VendorMapScreen: React.FC = () => {
  const { vendors, loading } = useData();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  const [isClusterModalVisible, setClusterModalVisible] = useState<boolean>(false);
  const [clusterVendors, setClusterVendors] = useState<Vendor[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // User location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false);
  
  // Map region state
  const [region, setRegion] = useState<Region>({
    latitude: 23.0225, // Gandhinagar, Gujarat
    longitude: 72.5714,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  // Zoom level calculate
  const mapZoom = useMemo(() => {
    return Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
  }, [region.latitudeDelta]);
  
  // Clustering
  const { clusteredPoints, getClusterExpansionZoom, getClusterLeaves } = useClustering(
    vendors,
    region,
    mapZoom
  );

  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

  // Initialize user location when component mounts
  useEffect(() => {
    initializeUserLocation();
  }, []);

  const initializeUserLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      setLocationPermissionGranted(hasPermission);
      
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          
          // Center map on user location
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Using default location.'
      );
    }
  };

  const centerOnUserLocation = useCallback(async () => {
    setLocationLoading(true);

   try {
    if (userLocation) {
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          zoom: 15,
          heading: 0,
          pitch: 0,
        },
        { duration: 1000 }
      );
    } else {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        mapRef.current?.animateCamera(
          {
            center: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            zoom: 15,
            heading: 0,
            pitch: 0,
          },
          { duration: 1000 }
        );
      } else {
        Alert.alert(
          'Location Unavailable',
          'Unable to get your current location. Please check your location settings.'
        );
      }
    }
  } finally {
    setLocationLoading(false); 
  }
}, [userLocation]);

  const handleVendorPress = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);

    mapRef.current?.animateCamera({
      center: {
        latitude: vendor.latitude,
        longitude: vendor.longitude,
      },
      zoom: 15,
      heading: 0,
      pitch: 0,
    }, { duration: 1000 });

    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleClusterPress = useCallback((clusterId: number, latitude: number, longitude: number) => {
    // Get vendors in this cluster
    const vendorsInCluster = getClusterLeaves(clusterId);
    
    if (vendorsInCluster.length > 0) {
      // If we can expand the cluster, zoom in
      const expansionZoom = getClusterExpansionZoom(clusterId);
      
      if (expansionZoom > mapZoom) {
        mapRef.current?.animateCamera({
          center: { latitude, longitude },
          zoom: expansionZoom,
        }, { duration: 500 });
      } else {
        // Show cluster modal with vendor list
        setClusterVendors(vendorsInCluster);
        setClusterModalVisible(true);
      }
    }
  }, [getClusterLeaves, getClusterExpansionZoom, mapZoom]);

  const handleMapPress = useCallback(() => {
    setSelectedVendor(null);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleRegionChange = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {locationLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={{ color: '#4CAF50', marginTop: 8 }}>Finding your location...</Text>
                </View>
              )}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider="google"
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        onPress={handleMapPress}
        showsUserLocation={false} // Disable default user location indicator
        showsMyLocationButton={false} // Disable default location button
        toolbarEnabled={false}
      >
        {/* Custom User Location Marker */}
        {userLocation && (
          <UserLocationMarker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          />
        )}


        {/* Vendor Markers and Clusters */}
        {clusteredPoints.map((point) => {
          if (point?.isCluster) {
            return (
              <ClusterMarker
                key={point.id}
                latitude={point.latitude}
                longitude={point.longitude}
                count={point.count ?? 0}
                onPress={() => handleClusterPress(point.clusterId!, point.latitude, point.longitude)}
              />
            );
          } else {
            return (
              <CustomVendorMarker
                key={point?.id}
                vendor={point?.vendor!}
                onPress={handleVendorPress}
                isSelected={selectedVendor?.id === point?.vendor?.id}
              />
            );
          }
        })}
      </MapView>

      <SearchBar />

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterVisible(true)}
      >
        <Icon name="tune" size={24} color="#06C167" /> 
      </TouchableOpacity>

      {/* Custom My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={centerOnUserLocation}
      >
        <Icon name="my-location" size={24} color="#06C167" />
      </TouchableOpacity>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
      />

      {/* Cluster Modal */}
      <ClusterModal
        visible={isClusterModalVisible}
        vendors={clusterVendors}
        onClose={() => setClusterModalVisible(false)}
        onVendorSelect={handleVendorPress}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        <BottomSheetTabs
          selectedVendor={selectedVendor}
          vendors={vendors}
          onVendorSelect={handleVendorPress}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},
  filterButton: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    zIndex: 1000,
    shadowColor: '#06C167',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 5,
    borderColor: '#06C167',
    borderWidth: 1.3
  },
  filterIcon: {
    fontSize: 20,
    color: '#fff',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#06C167',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    borderColor: '#06C167',
    borderWidth: 1.3
  },
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomSheetHandle: {
    backgroundColor: '#f0f0f0',
  },
});

export default VendorMapScreen;