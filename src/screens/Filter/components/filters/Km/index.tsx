import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Input } from '@components/index';
import { useFilters } from '@hooks/useFilters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';
import { Row } from '../styles';

interface KmFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const KmFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: KmFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [minKm, setMinKm] = useState<string>('');
  const [maxKm, setMaxKm] = useState<string>('');

  const handleSubmit = () => {
    if ((minKm && maxKm) && (minKm >= maxKm)) {
      Alert.alert('Atenção', 'O valor mínimo precisa ser inferior ao valor máximo')
      return;
    }
    setFilterParams({
      ...filterParams,
      quilometragem: {
        min: Number(minKm), max: Number(maxKm)
      },
    });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Quilometragem"
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
                value={minKm}
                onChangeText={(value) => setMinKm(value)}
                style={styles.input}
                placeholderTextColor={theme.colors['black-200']}
              />
            </View>
            <View style={{ width: '45%' }}>
              <Input
                placeholder="Máximo"
                keyboardType="number-pad"
                value={maxKm}
                onChangeText={(value) => setMaxKm(value)}
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
export default KmFilter;
