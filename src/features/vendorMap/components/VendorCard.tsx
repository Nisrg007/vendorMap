import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Vendor } from '../../../types/vendor';

interface VendorCardProps {
  vendor: Vendor;
  onPress: (vendor: Vendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(vendor)}>
    <Image source={{ uri: vendor.image }} style={styles.image} />

    <View style={styles.infoContainer}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>{vendor.name}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: vendor.isOpen ? '#DFF6E0' : '#F0F0F0' },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: vendor.isOpen ? '#4CAF50' : '#999' },
            ]}
          />
          <Text style={[styles.statusText, { color: vendor.isOpen ? '#4CAF50' : '#999' }]}>
            {vendor.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Icon name="star" size={14} color="#FFD700" />
        <Text style={styles.metaText}>{vendor.rating}</Text>
        <Text style={styles.metaText}>{vendor.priceRange}</Text>
        <Text style={styles.metaText}>{vendor.distance} km</Text>
      </View>

      <View style={styles.tagRow}>
        {vendor.tags.slice(0, 2).map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    marginRight: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 11,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
});

export default VendorCard;
