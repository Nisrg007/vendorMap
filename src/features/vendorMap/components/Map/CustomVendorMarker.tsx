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
  return (
    <Marker
      coordinate={{ latitude: vendor.latitude, longitude: vendor.longitude }}
      onPress={() => onPress(vendor)}
    >
      <View style={styles.wrapper}>
        <View
          style={[
            styles.outerCircle,
            {
              borderColor: !vendor.isOpen
                ? '#999'
                : vendor.isVeg
                ? '#4CAF50'
                : '#FF6B6B',
              transform: [{ scale: isSelected ? 1.2 : 1 }],
            },
          ]}
        >
          <Image source={{ uri: vendor.image }} style={styles.avatar} />
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
  outerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    shadowOpacity: 0.15,
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
