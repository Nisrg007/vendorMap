import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useData } from '../../services/DataProvider';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setFilters, refreshVendors } = useData();

  const handleSearch = async (
    e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Optional: trim + lowercase
    const query = searchQuery.trim().toLowerCase();

    // If query is empty, reset filters
    if (query === '') {
      setFilters((prev) => ({
        ...prev,
        minRating: null,
        priceRange: null,
      }));
      await refreshVendors();
      return;
    }

    // Otherwise, apply search-based filtering
    // (Optional: you can move this logic into DataProvider)
    setFilters((prev) => ({
      ...prev,
      // You can add tag matching or name contains logic if needed here
    }));

    await refreshVendors();
  };

  const clearSearch = () => {
    setSearchQuery('');
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search street food vendors..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 15,
    right: 70,
    zIndex: 1000,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
