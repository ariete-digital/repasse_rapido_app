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
  const [selectedState, setSelectedState] = useState<DataProps>();
  const [selectedCity, setSelectedCity] = useState<DataProps>();

  const handleSubmit = () => {
    setFilterParams({
      ...filterParams,
      id_cidade: selectedCity?.value || undefined,
      id_estado: selectedState?.value || undefined,
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
              <View>
                <AutocompleteDropdown
                  placeholder="Digite o estado"
                  label=""
                  filter="estados"
                  onChangeValue={(v) => setSelectedState(v as DataProps)}
                />
              </View>

              <View>
                <AutocompleteDropdown
                  placeholder="Digite a cidade"
                  label=""
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
