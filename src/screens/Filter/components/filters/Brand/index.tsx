import { useState } from 'react';
import { View } from 'react-native';

import AutocompleteDropdown from '@components/Autocomplete';
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
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const handleSubmit = () => {
    setFilterParams({
      ...filterParams,
      marca: selectedBrand,
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
          <Row>
            <View style={{ padding: 10 }}>
              <AutocompleteDropdown
                placeholder="Digite para pesquisar"
                label=""
                filter="marcas"
                onChangeValue={(v) => setSelectedBrand(v as string)}
              />
            </View>
          </Row>
        );
      }}
    />
  );
};

export default BrandFilter;
