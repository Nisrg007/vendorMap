import React, { useState } from 'react';
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
  const { filters, setFilters, refreshVendors } = useData();

  const toggleFilter = (key: keyof typeof filters, value: any) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value ? value : null,
  }));
};


  const resetAllFilters = () => {
    setFilters({
      isVeg: null,
      isOpen: null,
      priceRange: null,
      minRating: null,
      searchQuery: null,
    });
  };

  const applyFilters = async () => {
    await refreshVendors();
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== null).length;
  };

  const ratingOptions = [
    { value: 4.5, label: '4.5+' },
    { value: 4.0, label: '4.0+' },
    { value: 3.5, label: '3.5+' },
    { value: 3.0, label: '3.0+' },
  ];

  return (
    <Modal 
      animationType="slide" 
      transparent 
      visible={visible} 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.modalTitle}>Filters</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.activeFiltersCount}>
                  <Text style={styles.activeFiltersText}>
                    {getActiveFiltersCount()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={resetAllFilters}
                style={styles.resetButton}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* Food Type */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>
                <Icon name="eco" size={18} color="#4CAF50" style={styles.sectionIcon} />
                Food Type
              </Text>
              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabel}>
                    <Icon name="eco" size={20} color="#4CAF50" />
                    <Text style={styles.switchText}>Vegetarian Only</Text>
                  </View>
                  <Switch
                    value={filters.isVeg === true}
                    onValueChange={(value) => toggleFilter('isVeg', value)}
                    trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                    thumbColor={filters.isVeg === true ? '#ffffff' : '#f4f3f4'}
                    ios_backgroundColor="#E0E0E0"
                  />
                </View>
              </View>
            </View>

            {/* Availability */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>
                <Icon name="schedule" size={18} color="#FF9800" style={styles.sectionIcon} />
                Availability
              </Text>
              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabel}>
                    <Icon name="schedule" size={20} color="#FF9800" />
                    <Text style={styles.switchText}>Open Now</Text>
                  </View>
                  <Switch
                    value={filters.isOpen === true}
                    onValueChange={(value) => toggleFilter('isOpen', value)}
                    trackColor={{ false: '#E0E0E0', true: '#FF9800' }}
                    thumbColor={filters.isOpen === true ? '#ffffff' : '#f4f3f4'}
                    ios_backgroundColor="#E0E0E0"
                  />
                </View>
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>
                <Icon name="attach_money" size={18} color="#2196F3" style={styles.sectionIcon} />
                Price Range
              </Text>
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
                    <Text style={[
                      styles.priceDescription,
                      filters.priceRange === price && styles.priceDescriptionSelected,
                    ]}>
                      {price === '$' ? 'Budget' : price === '$$' ? 'Moderate' : 'Premium'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>
                <Icon name="star" size={18} color="#FFD700" style={styles.sectionIcon} />
                Minimum Rating
              </Text>
              <View style={styles.ratingContainer}>
                {ratingOptions.map((rating) => (
                  <TouchableOpacity
                    key={rating.value}
                    style={[
                      styles.ratingButton,
                      filters.minRating === rating.value && styles.ratingButtonSelected,
                    ]}
                    onPress={() => toggleFilter('minRating', rating.value)}
                  >
                    <Icon 
                      name="star" 
                      size={16} 
                      color={filters.minRating === rating.value ? '#fff' : '#FFD700'} 
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        filters.minRating === rating.value && styles.ratingTextSelected,
                      ]}
                    >
                      {rating.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>
                Apply Filters
                {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginRight: 8,
  },
  activeFiltersCount: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
  },
  resetText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  switchContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
    fontWeight: '500',
  },
  priceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  priceButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  priceTextSelected: {
    color: '#fff',
  },
  priceDescription: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  priceDescriptionSelected: {
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#F8F9FA',
    flex: 1,
    maxWidth: '48%',
    justifyContent: 'center',
  },
  ratingButtonSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  ratingText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 6,
    fontWeight: '600',
  },
  ratingTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#06C167',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#04A957',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default FilterModal;