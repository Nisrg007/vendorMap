// src/features/vendorMap/components/Map/CustomVendorMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Vendor } from '../../../../types/vendor';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  // Determine marker color based on vendor status and food type
  const getMarkerColor = () => {
    if (!vendor.isOpen) return '#555151ff'; // Gray for closed
    if (vendor.isVeg) return '#4C9950'; // Green for veg
    return '#E53E3E'; // Red for non-veg
  };

  const markerColor = getMarkerColor();

  return (
    <Marker
      coordinate={{ latitude: vendor.latitude, longitude: vendor.longitude }}
      onPress={() => onPress(vendor)}
      anchor={{ x: 0.5, y: 1 }} // Anchor at bottom center
    >
      <View style={styles.markerWrapper}>
        {/* Speech bubble container */}
        <View style={[styles.speechBubble, { backgroundColor: markerColor }]}>
          {/* Food truck icon */}
          <Icon 
            name="local-shipping" 
            size={18} 
            color="#ffffff" 
            style={styles.truckIcon}
          />
        </View>
        
        {/* Pointer/tail of speech bubble */}
        <View style={[styles.speechTail, { borderTopColor: markerColor }]} />
        
        {/* Vendor name label when selected */}
        {isSelected && (
          <View style={styles.nameLabel}>
            <Text style={styles.nameLabelText} numberOfLines={1}>
              {vendor.name}
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  speechTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  truckIcon: {
    textAlign: 'center',
  },
  nameLabel: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    maxWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  nameLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CustomVendorMarker;