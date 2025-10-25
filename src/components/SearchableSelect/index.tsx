import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutRectangle,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
  findNodeHandle,
  ScrollView,
} from 'react-native';
import { ChevronUpIcon, ChevronDownIcon } from '@components/CustomIcons';
import styled from 'styled-components/native';
import { Portal } from 'react-native-paper';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (option: Option) => void;
  selectedValue?: string;
}

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
`;

const IconContainer = styled.View`
  margin-left: 10px;
`;

const OptionItem = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  background-color: ${({ selected }) => (selected ? '#f0f0f0' : 'white')};
`;

const OptionText = styled.Text`
  font-size: 16px;
`;

const ITEM_HEIGHT = 48;
const MAX_VISIBLE_ITEMS = 5;

const dropdownShadow = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
    maxHeight: ITEM_HEIGHT * MAX_VISIBLE_ITEMS,
  },
});

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder,
  onSelect,
  selectedValue,
}) => {
  const inputRef = useRef<TouchableOpacity>(null);
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnimation = useState(new Animated.Value(0))[0];
  const [inputLayout, setInputLayout] = useState<LayoutRectangle | null>(null);

  useEffect(() => {
    if (selectedValue) {
      const found = options.find((opt) => opt.value === selectedValue);
      if (found) {
        setSelectedOption(found);
        setQuery(found.label);
      }
    }
  }, [selectedValue, options]);

  const measureInput = () => {
    const handle = findNodeHandle(inputRef.current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
        setInputLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const toggleDropdown = () => {
    if (dropdownVisible) {
      hideDropdown();
    } else {
      measureInput();
      setFilteredOptions(options);
      setDropdownVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(filtered);
    if (filtered.length > 0 && !dropdownVisible) {
      measureInput();
      setDropdownVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  };

  const hideDropdown = () => {
    Animated.timing(dropdownAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setDropdownVisible(false);
    });
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setQuery(option.label);
    hideDropdown();
    onSelect(option);
  };

  const calculatedHeight =
    Math.min(filteredOptions.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, calculatedHeight],
  });

  return (
    <>
      <TouchableOpacity
        onPress={toggleDropdown}
        ref={inputRef}
        activeOpacity={1}
        style={{ minHeight: 40, maxHeight: 40, flex: 1 }}
      >
        <InputContainer>
          <Input
            placeholder={placeholder || 'Selecione...'}
            value={query}
            onChangeText={handleInputChange}
            editable
          />
          <IconContainer>
            {dropdownVisible ? (
              <ChevronUpIcon size={20} color="gray" />
            ) : (
              <ChevronDownIcon size={20} color="gray" />
            )}
          </IconContainer>
        </InputContainer>
      </TouchableOpacity>

      {dropdownVisible && inputLayout && (
        <Portal>
          <TouchableWithoutFeedback onPress={hideDropdown}>
            <View style={StyleSheet.absoluteFillObject}>
              <Animated.View
                style={[
                  dropdownShadow.shadow,
                  {
                    position: 'absolute',
                    top: inputLayout.y + inputLayout.height,
                    left: inputLayout.x,
                    width: inputLayout.width,
                    height: dropdownHeight,
                  },
                ]}
              >
                <ScrollView
                  style={{ maxHeight: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
                  showsVerticalScrollIndicator={false}
                >
                  {filteredOptions.map((item) => (
                    <OptionItem
                      key={item.value}
                      selected={selectedOption?.value === item.value}
                      onPress={() => handleSelectOption(item)}
                    >
                      <OptionText>{item.label}</OptionText>
                    </OptionItem>
                  ))}
                </ScrollView>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}
    </>
  );
};

export default SearchableSelect;
