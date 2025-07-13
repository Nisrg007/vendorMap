// src/features/vendorMap/components/Map/CustomVendorMarker.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { Vendor } from '../../../../types/vendor';

interface CustomVendorMarkerProps {
  vendor: Vendor;
  onPress: (vendor: Vendor) => void;
  isSelected: boolean;
}

const CustomVendorMarker: React.FC<CustomVendorMarkerProps> = ({
  vendor,
  onPress,
  isSelected,
}) => {
  const borderColor = !vendor.isOpen
    ? '#A0A0A0' // gray for closed
    : vendor.isVeg
    ? '#4C9950' // green for veg
    : '#FF3B30'; // red for non-veg

  return (

    <Marker
      coordinate={{ latitude: vendor.latitude, longitude: vendor.longitude }}
      onPress={() => onPress(vendor)}
    >
      <View style={styles.wrapper}>
        <View
          style={[
            styles.markerContainer,
            {
              borderColor,
              transform: [{ scale: isSelected ? 1.2 : 1 }],
            },
          ]}
        >
          <Image 
            source={vendor.image ? { uri: vendor.image }: require('../../assets/tesla.png')} 
            style={styles.logo} 
            />
        </View>
        {isSelected && (
          <View style={styles.label}>
            <Text style={styles.labelText} numberOfLines={1}>
              {vendor.name}
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
   markerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  logo: {
    width: 28,
    height: 28,
  },
  label: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 5,
    maxWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default CustomVendorMarker;
