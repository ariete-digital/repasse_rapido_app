import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { useFilters } from '@hooks/useFilters';
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
  const [openMin, setOpenMin] = useState(false);
  const [openMax, setOpenMax] = useState(false);
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [minYear, setMinYear] = useState<number>();
  const [maxYear, setMaxYear] = useState<number>();

  const handleSubmit = () => {
    if (minYear && maxYear && minYear > maxYear) {
      Alert.alert('Atenção', 'O ano mínimo deve ser menor ou igual o máximo!');
      return;
    }

    setFilterParams({ ...filterParams, ano: { min: minYear, max: maxYear } });
    handleConfirm();
  };

  const years: { label: string; value: number }[] = [];
  for (let i = 2024; i >= 1924; i--) {
    years.push({ label: i.toString(), value: i });
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
              zIndex: 999,
              flexDirection: 'column',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DropDownPicker
              open={openMin}
              value={minYear as number}
              items={years}
              setOpen={setOpenMin}
              setValue={setMinYear}
              zIndex={999}
              style={pickerStyles.input}
              placeholder="Mínimo"
              dropDownContainerStyle={pickerStyles.container}
            />
            <DropDownPicker
              open={openMax}
              value={maxYear as number}
              items={years}
              setOpen={setOpenMax}
              setValue={setMaxYear}
              zIndex={998}
              style={pickerStyles.input}
              placeholder="Máximo"
              dropDownContainerStyle={pickerStyles.container}
            />
          </View>
        );
      }}
    />
  );
};

const pickerStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DBE2EF',
    backgroundColor: '#A0A4AC1A',
    borderRadius: 4,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  container: {
    maxWidth: '81%',
    marginLeft: 34,
    zIndex: 5000,
  },
});

export default YearFilter;
