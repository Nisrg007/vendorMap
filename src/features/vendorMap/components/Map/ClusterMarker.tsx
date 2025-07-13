// src/features/vendorMap/components/Map/ClusterMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

interface ClusterMarkerProps {
  latitude: number;
  longitude: number;
  count: number;
  onPress: () => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  latitude,
  longitude,
  count,
  onPress,
}) => {
  // Determine cluster size and color based on count
  const getClusterStyle = () => {
    if (count < 5) {
      return {
        size: 40,
        backgroundColor: '#bc0abcff',
        borderColor: '#ffffff',
      };
    } else if (count < 10) {
      return {
        size: 50,
        backgroundColor: '#1d8d0cff',
        borderColor: '#ffffff',
      };
    } else {
      return {
        size: 60,
        backgroundColor: '#1f098dff',
        borderColor: '#ffffff',
      };
    }
  };

  const clusterStyle = getClusterStyle();

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={styles.clusterWrapper}>
        {/* Cluster bubble */}
        <View
          style={[
            styles.clusterBubble,
            {
              width: clusterStyle.size,
              height: clusterStyle.size,
              borderRadius: clusterStyle.size / 2,
              backgroundColor: clusterStyle.backgroundColor,
              borderColor: clusterStyle.borderColor,
            },
          ]}
        >
          <Text style={styles.clusterText}>{count}</Text>
        </View>
        
        {/* Pointer/tail */}
        <View style={[styles.clusterTail, { borderTopColor: clusterStyle.backgroundColor }]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  clusterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clusterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clusterTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});

export default ClusterMarker;