import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/UI/SearchBar';
import FilterModal from '../components/UI/FilterModal';
import CustomVendorMarker from '../components/Map/CustomVendorMarker';
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
  
  // Map region state
  const [region, setRegion] = useState<Region>({
    latitude: 23.0225, // Gandhinagar, Gujarat
    longitude: 72.5714,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  //zoom level calculate
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
  },[]);

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
  },[]);

  const handleRegionChange = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);


  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider="google"
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        toolbarEnabled={false}
      >
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
        <Icon name="tune" size={24} color="#2E7D32" /> 
      </TouchableOpacity>

        {/* 📍 My Location Button */}
      {/* <TouchableOpacity
        style={styles.myLocationButton}
        onPress={centerOnUserLocation}
      >
        <Icon name="my-location" size={24} color="#ffffff" />
      </TouchableOpacity> */}

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
  filterButton: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: 'black',
    borderRadius: 25,
    padding: 12,
    zIndex: 1000,
    shadowColor: '#06C167',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 5,
    borderColor: '#06C167',
    borderWidth: 1
  },
  filterIcon: {
    fontSize: 20,
    color: '#fff',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    backgroundColor: '#4C9950',
    borderRadius: 25,
    padding: 12,
    zIndex: 1000,
    elevation: 5,
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
