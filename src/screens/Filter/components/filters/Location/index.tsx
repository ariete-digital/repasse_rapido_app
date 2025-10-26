import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

import AutocompleteDropdown, { DataProps } from '@components/Autocomplete';
import { useFilters } from '@hooks/useFilters';
import BaseFilterModal from '../../BaseFilter';

interface LocationFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const LocationFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: LocationFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [selectedCity, setSelectedCity] = useState<DataProps>();

  const handleSubmit = () => {
    setFilterParams({
      ...filterParams,
      id_cidade: selectedCity?.value || undefined,
      cidade_nome: selectedCity?.label || undefined, // Salvar o nome da cidade também
    });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Localização"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <SafeAreaView>
            <ScrollView>
              <View style={{ padding: 10 }}>
                <AutocompleteDropdown
                  placeholder="Digite a cidade"
                  label="Cidade"
                  filter="cidades"
                  onChangeValue={(v) => setSelectedCity(v as DataProps)}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    />
  );
};

export default LocationFilter;
