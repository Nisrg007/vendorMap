import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { Vendor } from '../../../../types/vendor';

interface VendorMarkerProps {
  vendor: Vendor;
  onPress: (vendor: Vendor) => void;
  isSelected: boolean;
}

const VendorMarker: React.FC<VendorMarkerProps> = ({ vendor, onPress, isSelected }) => {
  return (
    <Marker
      coordinate={{ latitude: vendor.latitude, longitude: vendor.longitude }}
      onPress={() => onPress(vendor)}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.marker,
            {
              backgroundColor: isSelected
                ? '#007AFF'
                : !vendor.isOpen
                ? '#999'
                : vendor.isVeg
                ? '#4CAF50'
                : '#FF6B6B',
            },
          ]}
        >
          <Image source={{ uri: vendor.image }} style={styles.avatar} />
        </View>
        {isSelected && (
          <View style={styles.label}>
            <Text style={styles.labelText}>{vendor.name}</Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  label: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default VendorMarker;