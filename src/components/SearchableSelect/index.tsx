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
  ActivityIndicator,
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
  onInputChange?: (query: string) => void;
  onIncrementalLoad?: (filter: string) => void;
  isLoading?: boolean;
  enableIncrementalLoading?: boolean;
  showChevron?: boolean;
  disabled?: boolean;
}

const InputContainer = styled.View<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ disabled }: { disabled?: boolean }) => (disabled ? '#f5f5f5' : 'white')};
  opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.8 : 1)}
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
  background-color: ${({ selected }: { selected?: boolean }) => (selected ? '#f0f0f0' : 'white')};
`;

const OptionText = styled.Text`
  font-size: 16px;
`;

const EmptyMessage = styled.View`
  padding: 10px 6px;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  width: 100%;
`;

const EmptyMessageText = styled.Text`
  font-size: 12px;
  color: #999;
  text-align: center;
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
  onInputChange,
  onIncrementalLoad,
  isLoading = false,
  enableIncrementalLoading = false,
  showChevron = true,
  disabled = false,
}) => {
  const inputRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnimation = useState(new Animated.Value(0))[0];
  const [inputLayout, setInputLayout] = useState<LayoutRectangle | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const hasTriggeredInitialLoad = useRef(false);
  const hasSearched = useRef(false);
  const isUserTyping = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Não atualizar se o usuário está digitando/apagando
    if (isUserTyping.current) {
      return;
    }

    // Não atualizar se o texto atual é diferente do que está selecionado
    // (isso significa que o usuário está editando)
    if (selectedOption && query !== selectedOption.label && query.trim() !== '') {
      return;
    }

    if (selectedValue) {
      const found = options.find((opt) => opt.value === selectedValue);
      if (found) {
        // Se o campo está vazio, não reaplicar automaticamente
        // (usuário apagou e não queremos reaplicar)
        if (query.trim() === '') {
          setSelectedOption(found);
          return;
        }
        
        // Só atualizar se o texto atual corresponder exatamente ao label
        // ou se o texto estiver completamente diferente (não é edição parcial)
        if (query === found.label) {
          setSelectedOption(found);
        } else {
          // Se é diferente, verificar se não é uma correspondência parcial
          const isPartialMatch = found.label.toLowerCase().includes(query.toLowerCase()) || 
                                query.toLowerCase().includes(found.label.toLowerCase());
          if (!isPartialMatch) {
            // Não é correspondência parcial, pode ser atualização externa
            setSelectedOption(found);
            setQuery(found.label);
          }
          // Se for correspondência parcial, não fazer nada (usuário está editando)
        }
      }
    } else {
      // Limpar quando selectedValue for undefined/null
      setSelectedOption(null);
      // Não limpar o query aqui - deixar o usuário continuar digitando se quiser
    }
  }, [selectedValue, options]);

  useEffect(() => {
    if (!onInputChange) {
      
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      
      setFilteredOptions(options);
    }
  }, [options, query, onInputChange]);

  const measureInput = () => {
    const handle = findNodeHandle(inputRef.current);
    if (handle) {
      UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
        setInputLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const toggleDropdown = () => {
    if (disabled) return;
    
    if (dropdownVisible) {
      hideDropdown();
    } else {
      measureInput();
      setFilteredOptions(options);
      setDropdownVisible(true);
      
      // Se tem onIncrementalLoad e enableIncrementalLoading, aplicar filtro inicial "a"
      if (onIncrementalLoad && enableIncrementalLoading && !hasTriggeredInitialLoad.current) {
        hasTriggeredInitialLoad.current = true;
        hasSearched.current = true; // Marcar que houve busca (carregamento incremental)
        setCurrentFilter('a');
        onIncrementalLoad('a');
      }
      
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  };

  const handleInputChange = (text: string) => {
    // Marcar que o usuário está digitando
    isUserTyping.current = true;
    
    // Limpar timeout anterior se existir
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setQuery(text);
    
    // Limpar seleção imediatamente se o usuário está editando
    if (selectedOption && text !== selectedOption.label) {
      setSelectedOption(null);
    }
    
    // Marcar que houve uma busca
    if (text.length > 0) {
      hasSearched.current = true;
    } else {
      // Se apagou tudo, limpar seleção
      setSelectedOption(null);
    }

    if (onInputChange) {
      onInputChange(text);
    } else {
      
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    
    if (options.length > 0 && !dropdownVisible) {
      measureInput();
      setDropdownVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }

    // Resetar flag após um delay maior (1 segundo) quando o usuário parar de digitar
    // Isso garante que enquanto estiver apagando/digitando, não haverá reaplicação
    typingTimeoutRef.current = setTimeout(() => {
      isUserTyping.current = false;
    }, 1000);
  };

  const hideDropdown = () => {
    Animated.timing(dropdownAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setDropdownVisible(false);
      // Reset para permitir carregar "a" novamente quando abrir
      if (enableIncrementalLoading) {
        hasTriggeredInitialLoad.current = false;
        setCurrentFilter('');
      }
      // Reset busca apenas se não houver query
      if (!query) {
        hasSearched.current = false;
      }
    });
  };

  const handleScroll = (event: any) => {
    if (!enableIncrementalLoading || !onIncrementalLoad || isLoading) {
      return;
    }

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && currentFilter) {
      // Obter próxima letra do alfabeto
      const nextChar = String.fromCharCode(currentFilter.charCodeAt(0) + 1);
      
      // Limitar até 'z'
      if (nextChar <= 'z') {
        setCurrentFilter(nextChar);
        onIncrementalLoad(nextChar);
      }
    }
  };

  const handleSelectOption = (option: Option) => {
    // Resetar flag de digitação quando selecionar uma opção
    isUserTyping.current = false;
    setSelectedOption(option);
    setQuery(option.label);
    hideDropdown();
    onSelect(option);
  };

  // Mostrar mensagem vazia apenas se houver busca ativa e não encontrar resultados
  const shouldShowEmptyMessage = 
    filteredOptions.length === 0 && 
    !isLoading && 
    hasSearched.current;

  const calculatedHeight = shouldShowEmptyMessage 
    ? ITEM_HEIGHT 
    : Math.min(filteredOptions.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

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
        disabled={disabled}
        style={{ minHeight: 40, maxHeight: 40, flex: 1 }}
      >
        <InputContainer disabled={disabled}>
          <Input
            placeholder={placeholder || 'Selecione...'}
            value={query}
            onChangeText={handleInputChange}
            editable={!disabled}
          />
          {showChevron && (
            <IconContainer>
              {dropdownVisible ? (
                <ChevronUpIcon size={20} color="gray" />
              ) : (
                <ChevronDownIcon size={20} color="gray" />
              )}
            </IconContainer>
          )}
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
                    width: shouldShowEmptyMessage 
                      ? Math.max(inputLayout.width, 180) 
                      : inputLayout.width,
                    height: dropdownHeight,
                  },
                ]}
              >
                <ScrollView
                  ref={scrollViewRef}
                  style={{ maxHeight: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={400}
                >
                  {shouldShowEmptyMessage ? (
                    <EmptyMessage>
                      <EmptyMessageText numberOfLines={2}>
                        Nenhum resultado encontrado
                      </EmptyMessageText>
                    </EmptyMessage>
                  ) : (
                    filteredOptions.map((item) => (
                      <OptionItem
                        key={item.value}
                        selected={selectedOption?.value === item.value}
                        onPress={() => handleSelectOption(item)}
                      >
                        <OptionText>{item.label}</OptionText>
                      </OptionItem>
                    ))
                  )}
                  {isLoading && enableIncrementalLoading && (
                    <View
                      style={{
                        padding: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ActivityIndicator size="small" color="#666" />
                    </View>
                  )}
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
