import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useData } from '../../services/DataProvider';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { allVendors, setFilters, refreshVendors, resetFilters } = useData();

  const handleSearch = async () => {
    const query = searchQuery.trim().toLowerCase();

    if (query === '') {
      resetFilters();
      await refreshVendors();
      return;
    }

    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));

    await refreshVendors();
    setIsFocused(false);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setSearchQuery('');
    resetFilters();
    refreshVendors();
    setSuggestions([]);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSuggestionPress = (text: string) => {
    setSearchQuery(text);
    handleSearch();
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const matches = allVendors
      .flatMap((vendor) => [vendor.name, ...(vendor.tags || [])])
      .filter((item) => item.toLowerCase().includes(lowerQuery))
      .filter((item, index, self) => self.indexOf(item) === index) // remove duplicates
      .slice(0, 5);

    setSuggestions(matches);
  }, [searchQuery, allVendors]);

  return (
    <TouchableWithoutFeedback onPress={() => {
      setIsFocused(false);
      setSuggestions([]);
      Keyboard.dismiss();
    }}>
      <View style={styles.container}>
        <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
          <Icon
            name="search"
            size={24}
            color={isFocused ? '#04A957' : '#8E8E93'}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={handleFocus}
            placeholder="Search your street ka swad..."
            placeholderTextColor="#8E8E93"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={()=>{
                clearSearch();
                Keyboard.dismiss();
              }}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="clear" size={20} color="#06C167" />
            </TouchableOpacity>
          )}
        </View>

        {isFocused && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((text, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(text)}
              >
                <Icon name="restaurant" size={16} color="#666" />
                <Text style={styles.suggestionText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#06C167', // theme green
    shadowColor: '#06C167', // soft green glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
  },
  searchBarFocused: {
    borderColor: '#06C167',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    fontWeight: '500',
    color: '#E5FFE9', // soft greenish white

  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'black',
    borderColor: '#06C167', // theme green
    shadowColor: '#06C167', // soft green glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth:1
  },
  suggestionsContainer: {
  backgroundColor: '#121212', // deep black for modern look
  borderRadius: 14,
  marginTop: 10,
  paddingVertical: 10,
  paddingHorizontal: 6,
  borderWidth: 1,
  borderColor: '#06C167', // theme green
  shadowColor: '#06C167', // soft green glow
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 6,
},
  suggestionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderBottomWidth: 0.5,
  borderBottomColor: '#2C2C2E', // subtle divider
},

suggestionText: {
  marginLeft: 10,
  fontSize: 15,
  color: '#E5FFE9', // soft greenish white
  fontWeight: '500',
},
});

export default SearchBar;
