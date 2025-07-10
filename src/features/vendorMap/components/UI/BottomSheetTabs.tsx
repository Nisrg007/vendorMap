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

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
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
      </View>

      <ScrollView style={styles.vendorsList}>
        {getTabData().map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} onPress={() => onVendorSelect(vendor)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  vendorsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default BottomSheetTabs;
