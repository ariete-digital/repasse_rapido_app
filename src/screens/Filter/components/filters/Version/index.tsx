import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Input } from '@components/index';
import { useFilters } from '@hooks/useFilters';
import BaseFilterModal from '../../BaseFilter';

interface VersionFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const VersionFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: VersionFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [version, setVersion] = useState(filterParams.versao_veiculo || '');

  useEffect(() => {
    if (isVisible) setVersion(filterParams.versao_veiculo || '');
  }, [isVisible, filterParams.versao_veiculo]);

  const handleSubmit = () => {
    const trimmed = version.trim();
    setFilterParams({
      ...filterParams,
      versao_veiculo: trimmed || undefined,
    });
    handleConfirm();
  };

  return (
    <BaseFilterModal
      title="Versão"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => (
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Input
            label="Versão do veículo"
            placeholder="Ex: 1.0 MPI, XRX Hybrid"
            value={version}
            onChangeText={setVersion}
          />
        </View>
      )}
    />
  );
};

export default VersionFilter;
