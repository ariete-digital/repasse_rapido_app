import { useState } from 'react';
import { Alert, View } from 'react-native';

import { useFilters } from '@hooks/useFilters';
import Select from '@components/Select';
import BaseFilterModal from '../../BaseFilter';

interface YearFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const YearFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: YearFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');

  const handleSubmit = () => {
    const minYearNum = minYear ? parseInt(minYear) : undefined;
    const maxYearNum = maxYear ? parseInt(maxYear) : undefined;
    
    if (minYearNum && maxYearNum && minYearNum > maxYearNum) {
      Alert.alert('Atenção', 'O ano mínimo deve ser menor ou igual o máximo!');
      return;
    }

    setFilterParams({ ...filterParams, ano: { min: minYearNum, max: maxYearNum } });
    handleConfirm();
  };

  const years: { label: string; value: string }[] = [];
  for (let i = 2024; i >= 1924; i--) {
    years.push({ label: i.toString(), value: i.toString() });
  }

  return (
    <BaseFilterModal
      title="Ano"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <View
            style={{
              flexDirection: 'column',
              gap: 16,
              paddingHorizontal: 16,
            }}
          >
            <Select
              label="Ano Mínimo"
              options={years}
              selectedValue={minYear}
              onSelect={setMinYear}
              placeholder="Mínimo"
              enableSearch={true}
              searchPlaceholder="Buscar ano..."
              labelFontStyle="p-14-regular"
              placeholderFontStyle="p-14-regular"
            />
            <Select
              label="Ano Máximo"
              options={years}
              selectedValue={maxYear}
              onSelect={setMaxYear}
              placeholder="Máximo"
              enableSearch={true}
              searchPlaceholder="Buscar ano..."
              labelFontStyle="p-14-regular"
              placeholderFontStyle="p-14-regular"
            />
          </View>
        );
      }}
    />
  );
};

export default YearFilter;
