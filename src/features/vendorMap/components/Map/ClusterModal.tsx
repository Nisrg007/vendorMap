// src/features/vendorMap/components/UI/ClusterModal.tsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Vendor } from '../../../../types/vendor';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ClusterModalProps {
  visible: boolean;
  vendors: Vendor[];
  onClose: () => void;
  onVendorSelect: (vendor: Vendor) => void;
}

const ClusterModal: React.FC<ClusterModalProps> = ({
  visible,
  vendors,
  onClose,
  onVendorSelect,
}) => {
  const handleVendorPress = (vendor: Vendor) => {
    onVendorSelect(vendor);
    onClose();
  };

  const renderVendorItem = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.vendorItem}
      onPress={() => handleVendorPress(item)}
    >
      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <View style={styles.statusContainer}>
            {/* Food type indicator */}
            <View
              style={[
                styles.foodTypeIndicator,
                { backgroundColor: item.isVeg ? '#4C9950' : '#E53E3E' },
              ]}
            />
            {/* Open/closed status */}
            <Text style={[styles.statusText, { color: item.isOpen ? '#4C9950' : '#E53E3E' }]}>
              {item.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
        
        {/* Area/address */}
        <Text style={styles.vendorArea}>{item.area}</Text>
        
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {item.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
          {item.categories.length > 3 && (
            <Text style={styles.moreCategoriesText}>+{item.categories.length - 3} more</Text>
          )}
        </View>
      </View>
      
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Vendors at this location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={vendors}
          renderItem={renderVendorItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    paddingTop: 8,
  },
  vendorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodTypeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  vendorArea: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  moreCategoriesText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
});

export default ClusterModal;