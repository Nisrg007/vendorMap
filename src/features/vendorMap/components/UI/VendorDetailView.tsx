import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Vendor } from '../../../../types/vendor';

interface VendorDetailViewProps {
  vendor: Vendor;
}

const VendorDetailView: React.FC<VendorDetailViewProps> = ({ vendor }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
      </View>

      <View style={styles.content}>
        <Text style={styles.vendorName}>{vendor.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={styles.metaText}>{vendor.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.metaItem}>
            <Icon name="attach-money" size={18} color="#666" />
            <Text style={styles.metaText}>{vendor.priceRange}</Text>
          </View>

          <View style={styles.metaItem}>
            <Icon name="location-on" size={18} color="#666" />
            <Text style={styles.metaText}>{vendor.distance} km</Text>
          </View>

          <View style={styles.metaItem}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: vendor.isOpen ? '#4CAF50' : '#999' },
              ]}
            />
            <Text style={styles.metaText}>
              {vendor.isOpen ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{vendor.description}</Text>

        <View style={styles.tagContainer}>
          {vendor.tags.map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="restaurant-menu" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="rate-review" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Reviews</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.primaryActions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon name="directions" size={24} color="#fff" />
            <Text style={styles.primaryText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon name="phone" size={24} color="#fff" />
            <Text style={styles.primaryText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon name="favorite-border" size={24} color="#fff" />
            <Text style={styles.primaryText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },
  vendorImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
  },
  vendorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#555',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  primaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default VendorDetailView;
