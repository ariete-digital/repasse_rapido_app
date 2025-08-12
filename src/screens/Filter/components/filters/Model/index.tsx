import { View } from 'react-native';
import { useState } from 'react';

import { useFilters } from '@hooks/useFilters';
import BaseFilterModal from '../../BaseFilter';
import { Row } from '../styles';
import AutocompleteDropdown from '@components/Autocomplete';

interface ModelFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const ModelFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: ModelFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleSubmit = () => {
    setFilterParams({
      ...filterParams,
      modelo: selectedModel,
    });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Modelo"
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
                filter="modelos"
                onChangeValue={(v) => setSelectedModel(v as string)}
              />
            </View>
          </Row>
        );
      }}
    />
  );
};

export default ModelFilter;
