import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';

import AutocompleteDropdown from '@components/Autocomplete';
import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import BaseFilterModal from '../../BaseFilter';
import { Row } from '../styles';

interface BrandFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const BrandFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: BrandFilterProps) => {
  const { filterParams, setFilterParams, isLoading, filterValues } = useFilters();
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  // Carregar seleção existente
  useEffect(() => {
    if (filterParams.marca) {
      setSelectedBrand(filterParams.marca);
    }
  }, [filterParams.marca]);

  const handleSubmit = () => {
    setFilterParams({
      ...filterParams,
      marca: selectedBrand || undefined,
    });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Marca"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <ScrollView style={{ maxHeight: 400 }}>
            <Row>
              <View style={{ padding: 10 }}>
                <AutocompleteDropdown
                  placeholder="Digite para pesquisar"
                  label="Marca"
                  filter="marcas"
                  onChangeValue={(v) => setSelectedBrand(v as string)}
                />
              </View>
            </Row>
          </ScrollView>
        );
      }}
    />
  );
};

export default BrandFilter;
