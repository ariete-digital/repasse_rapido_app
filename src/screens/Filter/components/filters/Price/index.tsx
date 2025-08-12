import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Input } from '@components/index';
import { useFilters } from '@hooks/useFilters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';
import { Row } from '../styles';

interface PriceFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const PriceFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: PriceFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const formatCurrency = (value: string) => {
    let cleanValue = value.replace(/\D/g, '');
    let intValue = parseInt(cleanValue);
    let formattedValue = `R$ ${intValue.toLocaleString('pt-BR')}`;

    return formattedValue;
  };

  const unmaskCurrency = (value: string) => {
    return Number(value.replace(/[^\d]/g, ''));
  };

  const handleSubmit = () => {
    if ((minPrice && maxPrice) && (minPrice >= maxPrice)) {
      Alert.alert('Atenção', 'O valor mínimo precisa ser inferior ao valor máximo')
      return;
    }
    setFilterParams({
      ...filterParams,
      valor: { min: unmaskCurrency(minPrice), max: unmaskCurrency(maxPrice) },
    });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Valor"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <Row style={{ marginVertical: 16 }}>
            <View style={{ width: '45%' }}>
              <Input
                placeholder="Mínimo"
                keyboardType="number-pad"
                value={minPrice}
                onChangeText={(value) => setMinPrice(formatCurrency(value))}
                style={styles.input}
                placeholderTextColor={theme.colors['black-200']}
              />
            </View>
            <View style={{ width: '45%' }}>
              <Input
                placeholder="Máximo"
                keyboardType="number-pad"
                value={maxPrice}
                onChangeText={(value) => setMaxPrice(formatCurrency(value))}
                style={styles.input}
                placeholderTextColor={theme.colors['black-200']}
              />
            </View>
          </Row>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: theme.colors['gray-300'],
    backgroundColor: theme.colors['gray-100']
  }
})
export default PriceFilter;
