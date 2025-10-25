import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SearchIcon, ArrowDownIcon } from '@components/CustomIcons';
import { Text } from '@components/index';

export interface SearchFiltersProps {
  onAdNumberChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onAdNumberChange,
  onLocationChange,
}) => {
  const [adNumber, setAdNumber] = useState('');
  const [location, setLocation] = useState('São Paulo');

  const handleAdNumberChange = (value: string) => {
    setAdNumber(value);
    onAdNumberChange?.(value);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onLocationChange?.(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.inputContainer}>
          <View style={styles.searchIcon}>
            <SearchIcon size={20} color="#1E3A8A" />
          </View>
          <TextInput
            placeholder="Número do Anúncio"
            placeholderTextColor="#9CA3AF"
            value={adNumber}
            onChangeText={handleAdNumberChange}
            style={styles.inputStyle}
          />
        </View>
      </View>

      <View style={styles.locationSection}>
        <View style={styles.locationLabel}>
          <Text fontStyle="c-12-regular" color="black-200">
            Localização do Veículo
          </Text>
        </View>
        <TouchableOpacity style={styles.locationButton}>
          <Text fontStyle="p-14-regular" color="black-200" style={{ flex: 1 }}>
            {location}
          </Text>
          <ArrowDownIcon size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 30,
    gap: 12,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  searchSection: {
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  inputStyle: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 5,
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#374151',
  },
  locationSection: {
    flex: 1,
  },
  locationLabel: {
    marginBottom: 4,
  },
  locationButton: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 12,
  },
});

export default SearchFilters;
