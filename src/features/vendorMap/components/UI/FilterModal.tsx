import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useData } from '../../services/DataProvider';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { filters, setFilters } = useData();

  const toggleFilter = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Food Type</Text>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Vegetarian Only</Text>
                <Switch
                  value={filters.isVeg === true}
                  onValueChange={(value) => toggleFilter('isVeg', value)}
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Open Now</Text>
                <Switch
                  value={filters.isOpen === true}
                  onValueChange={(value) => toggleFilter('isOpen', value)}
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceButtonsContainer}>
                {['$', '$$', '$$$'].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceButton,
                      filters.priceRange === price && styles.priceButtonSelected,
                    ]}
                    onPress={() => toggleFilter('priceRange', price)}
                  >
                    <Text
                      style={[
                        styles.priceText,
                        filters.priceRange === price && styles.priceTextSelected,
                      ]}
                    >
                      {price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  priceButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  priceButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  priceTextSelected: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
