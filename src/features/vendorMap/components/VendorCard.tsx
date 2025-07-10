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

    <View style={styles.info}>
      <Text style={styles.name}>{vendor.name}</Text>

      <View style={styles.meta}>
        <Icon name="star" size={14} color="#FFD700" />
        <Text style={styles.rating}>{vendor.rating}</Text>
        <Text style={styles.price}>{vendor.priceRange}</Text>
        <Text style={styles.distance}>{vendor.distance}km</Text>
      </View>

      <View style={styles.tags}>
        {vendor.tags.slice(0, 2).map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </View>

    <View style={styles.status}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: vendor.isOpen ? '#4CAF50' : '#999' },
        ]}
      />
      <Text style={styles.statusText}>
        {vendor.isOpen ? 'Open' : 'Closed'}
      </Text>
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  price: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 10,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 2,
  },
  status: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
});

export default VendorCard;
