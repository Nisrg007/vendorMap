import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Vendor } from '../../../../types/vendor';

interface VendorDetailViewProps {
  vendor: Vendor;
}

const VendorDetailView: React.FC<VendorDetailViewProps> = ({ vendor }) => (
  <ScrollView style={styles.container}>
    <Image source={{ uri: vendor.image }} style={styles.vendorImage} />

    <View style={styles.vendorInfo}>
      <Text style={styles.vendorName}>{vendor.name}</Text>

      <View style={styles.vendorMeta}>
        <Icon name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{vendor.rating}</Text>
        <Text style={styles.price}>{vendor.priceRange}</Text>
        <Text style={styles.distance}>{vendor.distance}km away</Text>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: vendor.isOpen ? '#4CAF50' : '#999' },
          ]}
        />
        <Text style={styles.statusText}>{vendor.isOpen ? 'Open' : 'Closed'}</Text>
      </View>

      <Text style={styles.description}>{vendor.description}</Text>

      <View style={styles.tags}>
        {vendor.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </View>

    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="directions" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Directions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Icon name="phone" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Call</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Icon name="favorite-border" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  vendorImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  vendorInfo: {
    padding: 20,
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    marginRight: 12,
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  distance: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default VendorDetailView;
