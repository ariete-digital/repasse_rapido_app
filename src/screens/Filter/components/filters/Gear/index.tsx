import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import { GenericItem } from '@services/filters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';
import { Col } from '../styles';

interface GearFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const GearFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: GearFilterProps) => {
  const { searchResults, filterParams, setFilterParams, isLoading } =
    useFilters();
  const [selectedGear, setSelectedGear] = useState<number[]>([]);
  const [options, setOptions] = useState<GenericItem[]>(
    searchResults?.listaTiposCambio || []
  );

  const handleToggle = (value: number) => {
    setSelectedGear((prevSelectedGear) => {
      if (prevSelectedGear.includes(value)) {
        return prevSelectedGear.filter((item) => item !== value);
      } else {
        return [...prevSelectedGear, value];
      }
    });
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, tipos_cambio: selectedGear });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Câmbio"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <Col style={{ marginVertical: 16 }}>
            {options.map(({ id, descricao }) => (
              <TouchableOpacity
                key={id}
                onPress={() => handleToggle(id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Checkbox
                  disabled={false}
                  value={
                    selectedGear.includes(id) ||
                    filterParams.tipos_cambio?.includes(id)
                  }
                  onValueChange={() => handleToggle(id)}
                  color={theme.colors['brand-blue']}
                />
                <Text color="black-700">{descricao}</Text>
              </TouchableOpacity>
            ))}
          </Col>
        );
      }}
    />
  );
};

export default GearFilter;
