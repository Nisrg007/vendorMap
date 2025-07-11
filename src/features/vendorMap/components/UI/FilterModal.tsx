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
import Svg, { Circle, Path, Polygon, G, Defs, LinearGradient, Stop } from 'react-native-svg';



interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FoodIconProps {
  type: 'taco' | 'pizza' | 'burger' | 'noodles';
  size?: number;
  color?: string;
}

// Street Food Mandala Component
const StreetFoodMandala = ({ size = 40, color = '#FF6B35' }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Defs>
      <LinearGradient id="foodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
      </LinearGradient>
    </Defs>
    <G transform="translate(20,20)">
      {/* Central circle */}
      <Circle r="3" fill={color} />

      {/* Food elements arranged in mandala pattern */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
        <G key={index} transform={`rotate(${angle})`}>
          <Path
            d="M 0,-12 Q 2,-14 4,-12 Q 2,-10 0,-12"
            fill="url(#foodGradient)"
          />
          <Circle r="1.5" cx="0" cy="-8" fill={color} opacity="0.6" />
        </G>
      ))}

      {/* Outer decorative ring */}
      <Circle r="16" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <Circle r="14" fill="none" stroke={color} strokeWidth="0.3" opacity="0.2" />
    </G>
  </Svg>
);

// Decorative Food Icon Component
const FoodIcon: React.FC<FoodIconProps> = ({ type, size = 20, color = '#FF6B35' }) => {
  const paths = {
    taco:
      'M2 8c0-1.5 1.5-3 4-3s4 1.5 4 3v1c0 1.5-1.5 3-4 3s-4-1.5-4-3V8z M3 8h6 M4 6v4 M6 6v4 M8 6v4',
    pizza:
      'M12 2L2 7l10 5 10-5-10-5z M2 7l10 5 M12 2v10 M22 7l-10 5',
    burger:
      'M4 6h12c1 0 2 1 2 2v1H2V8c0-1 1-2 2-2z M2 9h16v2c0 1-1 2-2 2H4c-1 0-2-1-2-2V9z M6 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
    noodles:
      'M4 4c0 2 2 4 4 4s4-2 4-4 M4 8c0 2 2 4 4 4s4-2 4-4 M4 12c0 2 2 4 4 4s4-2 4-4',

  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={paths[type] || paths.taco}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

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
          {/* Decorative Header with Mandala */}
          <View style={styles.decorativeHeader}>
            <StreetFoodMandala size={60} color="#FF6B35" />
            <View style={styles.headerMandalaLeft}>
              <StreetFoodMandala size={30} color="#FFD23F" />
            </View>
            <View style={styles.headerMandalaRight}>
              <StreetFoodMandala size={25} color="#06C167" />
            </View>
          </View>

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
            <View style={[styles.filterSection, styles.vegSection]}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionTitleLeft}>
                  <Icon name="dinner-dining" size={20} color="#4CAF50" />
                  <Text style={styles.sectionTitle}>Food Type</Text>
                </View>
                <StreetFoodMandala size={30} color="#4CAF50" />
              </View>
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
            <View style={[styles.filterSection, styles.timeSection]}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionTitleLeft}>
                  <Icon name="location-on" size={20} color="#4CAF50" />
                  <Text style={styles.sectionTitle}>Availability</Text>
                </View>
                <StreetFoodMandala size={30} color="#FF9800" />
              </View>
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
            <View style={[styles.filterSection, styles.priceSection]}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionTitleLeft}>
                  <Icon name="attach-money" size={20} color="#4CAF50" />
                  <Text style={styles.sectionTitle}>Price Range</Text>
                </View>
                <StreetFoodMandala size={30} color="#2196F3" />
              </View>
              <View style={styles.priceButtonsContainer}>
                {['₹', '₹₹', '₹₹₹'].map((price, index) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceButton,
                      filters.priceRange === price && styles.priceButtonSelected,
                    ]}
                    onPress={() => toggleFilter('priceRange', price)}
                  >
                    <View style={styles.priceButtonContent}>
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
                        {price === '₹' ? 'Budget' : price === '₹₹' ? 'Moderate' : 'Premium'}
                      </Text>
                      <View style={styles.priceIcon}>
                        <Icon
                          name={
                            price === '₹'
                              ? 'money-off'
                              : price === '₹₹'
                                ? 'attach-money'
                                : 'payments'
                          }
                          size={16}
                          color={filters.priceRange === price ? '#fff' : '#2196F3'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={[styles.filterSection, styles.ratingSection]}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionTitleLeft}>
                  <Icon name="stars" size={20} color="#FFD700" />
                  <Text style={styles.sectionTitle}>Rating</Text>
                </View>
                <StreetFoodMandala size={30} color="#FFD700" />
              </View>
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

          {/* Apply Button with Decorative Elements */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonDecorative}>
              <StreetFoodMandala size={20} color="#06C167" />
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>
                  Apply Filters
                  {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
                </Text>
              </TouchableOpacity>
              <StreetFoodMandala size={20} color="#06C167" />
            </View>
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
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  decorativeHeader: {
    height: 40,
    backgroundColor: '#FFF8F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4CC',
  },
  headerMandalaLeft: {
    position: 'absolute',
    left: 30,
    top: 5,
  },
  headerMandalaRight: {
    position: 'absolute',
    right: 30,
    top: 7,
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
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
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
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFD23F',
  },
  resetText: {
    color: '#FF6B35',
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
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  vegSection: {
    backgroundColor: '#F1F8E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  timeSection: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  priceSection: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  ratingSection: {
    backgroundColor: '#FFFDE7',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  switchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  priceButtonContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
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
    marginBottom: 8,
  },
  priceDescriptionSelected: {
    color: '#fff',
  },
  priceIcon: {
    marginTop: 4,
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
    backgroundColor: '#FFFFFF',
    flex: 1,
    maxWidth: '48%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF8F0',
  },
  buttonDecorative: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applyButton: {
    backgroundColor: '#06C167',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#04A957',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    marginHorizontal: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  patternBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default FilterModal;