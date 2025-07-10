import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import VendorCard from '../VendorCard';
import VendorDetailView from './VendorDetailView';
import { Vendor } from '../../../../types/vendor';

interface BottomSheetTabsProps {
  selectedVendor: Vendor | null;
  vendors: Vendor[];
  onVendorSelect: (vendor: Vendor) => void;
}

const BottomSheetTabs: React.FC<BottomSheetTabsProps> = ({
  selectedVendor,
  vendors,
  onVendorSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'Popular' | 'Favorites' | 'Visited'>('Popular');

  const tabs: Array<'Popular' | 'Favorites' | 'Visited'> = ['Popular', 'Favorites', 'Visited'];

  const getTabData = (): Vendor[] => {
    switch (activeTab) {
      case 'Popular':
        return [...vendors].sort((a, b) => b.popularity - a.popularity);
      case 'Favorites':
        return vendors.filter((v) => v.isFavorite);
      case 'Visited':
        return vendors.filter((v) => v.isVisited);
      default:
        return vendors;
    }
  };

  if (selectedVendor) {
    return <VendorDetailView vendor={selectedVendor} />;
  }

  const filteredVendors = getTabData();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.vendorsList}>
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onPress={() => onVendorSelect(vendor)} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No vendors found in this tab.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabScroll: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tabContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  vendorsList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default BottomSheetTabs;
