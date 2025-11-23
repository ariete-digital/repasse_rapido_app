import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, TextInput as RNTextInput } from 'react-native';
import Text from '@components/Text';
import { theme } from '@theme/GlobalStyles';
import BasicButton from '@components/BasicButton';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  labelFontStyle?: string;
  placeholderFontStyle?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Selecione uma opção',
  error,
  label,
  disabled = false,
  labelFontStyle = 'p-14-bold',
  placeholderFontStyle = 'p-14-bold',
  enableSearch = false,
  searchPlaceholder = 'Buscar...',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedOption = options.find(opt => opt.value === selectedValue);
  
  const filteredOptions = searchQuery
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;
  
  const handleSelect = (value: string) => {
    onSelect(value);
    setModalVisible(false);
    setSearchQuery(''); 
  };

  const openModal = () => {
    if (!disabled) {
      setModalVisible(true);
      setSearchQuery(''); 
    }
  };

  return (
    <View>
      {label && (
        <Text fontStyle={labelFontStyle as any} color="black" style={{ marginBottom: 8 }}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={{
          backgroundColor: disabled ? '#F5F5F5' : '#F3F2ED',
          borderRadius: 8,
          padding: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderWidth: error ? 1 : 0,
          borderColor: error ? '#E11138' : 'transparent',
          opacity: disabled ? 0.6 : 1,
        }}
        onPress={openModal}
        disabled={disabled}
      >
        <Text 
          fontStyle={placeholderFontStyle as any}
          color={disabled ? "gray-500" : "black"}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Text 
          fontStyle="p-16-bold" 
          color={disabled ? "gray-500" : "black"}
        >
          ▼
        </Text>
      </TouchableOpacity>
      
      {error && (
        <Text fontStyle="c-12-regular" color="red" style={{ marginTop: 4 }}>
          {error}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            width: '100%',
            maxHeight: '70%',
          }}>
            <Text fontStyle="p-16-bold" color="black" style={{ marginBottom: 20, textAlign: 'center' }}>
              {label || 'Selecione uma opção'}
            </Text>
            
            {enableSearch && (
              <View style={{
                backgroundColor: '#F3F2ED',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text fontStyle="p-16-bold" color="gray-500" style={{ marginRight: 8 }}>
                  🔍
                </Text>
                <RNTextInput
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000',
                  }}
                  placeholderTextColor="#999"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text fontStyle="p-16-bold" color="gray-500">
                      ✕
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F2ED',
                    backgroundColor: selectedValue === item.value ? '#F3F2ED' : 'transparent',
                  }}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text 
                    fontStyle="p-14-regular" 
                    color={selectedValue === item.value ? 'brand-red-dark' : 'black'}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text fontStyle="p-14-regular" color="gray-500">
                    Nenhuma opção encontrada
                  </Text>
                </View>
              }
            />

            <BasicButton
              label="Cancelar"
              onPress={() => setModalVisible(false)}
              backgroundColor={theme.colors['brand-red-dark']}
              color='white'
              customStyles={{marginTop: 20}}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Select;
