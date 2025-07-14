// 1. First, create a custom UserLocationMarker component
// components/Map/UserLocationMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface UserLocationMarkerProps {
  latitude: number;
  longitude: number;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  latitude,
  longitude,
}) => {
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={1000}
    >
      <View style={styles.container}>
        <View style={styles.pulseContainer}>
          <View style={styles.pulseRing} />
          <View style={styles.innerDot}>
            <Icon name="person" size={16} color="#ffffff" />
          </View>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>You are here</Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  pulseRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(66, 165, 245, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(66, 165, 245, 0.5)',
  },
  innerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#42A5F5',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  labelContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  labelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UserLocationMarker;