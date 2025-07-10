import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/UI/SearchBar';
import FilterModal from '../components/UI/FilterModal';
import VendorMarker from '../components/Map/VendorMarker';
import BottomSheetTabs from '../components/UI/BottomSheetTabs';
import { useData } from '../services/DataProvider';
import { Vendor } from '../../../types/vendor';

const VendorMapScreen: React.FC = () => {
  const { vendors, loading } = useData();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);

  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

  const handleVendorPress = (vendor: Vendor) => {
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
  };

  const handleMapPress = () => {
    setSelectedVendor(null);
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={'google'}
        initialRegion={{
          latitude: 19.076,
          longitude: 72.8777,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {vendors.map((vendor) => (
          <VendorMarker
            key={vendor.id}
            vendor={vendor}
            onPress={handleVendorPress}
            isSelected={selectedVendor?.id === vendor.id}
          />
        ))}
      </MapView>

      <SearchBar />

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterVisible(true)}
      >
        <Text style={styles.filterIcon}>⚙️</Text>
      </TouchableOpacity>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
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
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  filterIcon: {
    fontSize: 20,
    color: '#fff',
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
