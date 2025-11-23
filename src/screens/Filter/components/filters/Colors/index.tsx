import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Text from '@components/Text';
import { DefaultValue } from '@contexts/FiltersContext';
import { useFilters } from '@hooks/useFilters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';

interface ColorsFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const ColorsFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: ColorsFilterProps) => {
  const { filterParams, setFilterParams, isLoading, filterValues } =
    useFilters();
  const [selectedColor, setSelectedColor] = useState<number | undefined>(
    undefined
  );

  const handleToggle = (value: number) => {
    setSelectedColor(value);
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, cor: selectedColor });
    handleConfirm();
  };

  const options: DefaultValue[] = filterValues.colors || [];

  useEffect(() => {
    if (isVisible) {
      setSelectedColor(filterParams.cor ?? undefined);
    }
  }, [isVisible, filterParams.cor]);

  return (
    <BaseFilterModal
      title="Cores"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => (
        <View style={{ gap: 16, paddingVertical: 16 }}>
          {options.map(({ value, label }) => (
            <View
              key={value}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Checkbox
                disabled={false}
                value={selectedColor === value}
                onValueChange={() => handleToggle(value)}
                color={theme.colors['brand-blue']}
              />
              <Text color="black-700">{label}</Text>
            </View>
          ))}
        </View>
      )}
    />
  );
};

export default ColorsFilter;
