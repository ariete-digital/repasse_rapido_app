import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { View } from 'react-native';

import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';
import { Row } from '../styles';

interface VehicleTypeFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const VehicleTypeFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: VehicleTypeFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [vehicleType, setVehicleType] = useState<'C' | 'M'>(
    filterParams.tipo_veiculo ?? 'C'
  );

  const handleToggle = (field: 'C' | 'M') => {
    setVehicleType(field);
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, tipo_veiculo: vehicleType });
    handleConfirm();
  };

  const options: ['C', 'M'] = ['C', 'M'];

  return (
    <BaseFilterModal
      title="Carro ou Moto?"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <Row style={{ marginVertical: 24 }}>
            {options.map((value: 'C' | 'M') => (
              <View
                key={value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 5,
                }}
              >
                <Checkbox
                  disabled={false}
                  value={vehicleType === value}
                  onValueChange={() => handleToggle(value)}
                  color={theme.colors['brand-blue']}
                />
                <Text color="black-700">
                  {value === 'C' ? 'Carro' : 'Moto'}
                </Text>
              </View>
            ))}
          </Row>
        );
      }}
    />
  );
};

export default VehicleTypeFilter;
