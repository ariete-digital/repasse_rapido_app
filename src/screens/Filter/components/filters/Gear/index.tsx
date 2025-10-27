import Checkbox from 'expo-checkbox';
import { useState, useEffect } from 'react';
import { TouchableOpacity, View, ScrollView } from 'react-native';

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
  const { searchResults, filterParams, setFilterParams, isLoading, filterValues } =
    useFilters();
  const [selectedGear, setSelectedGear] = useState<number[]>([]);
  const [options, setOptions] = useState<GenericItem[]>([]);

  // Atualizar options quando os dados estiverem disponíveis
  useEffect(() => {
    
    // Tentar diferentes fontes de dados
    let tiposCambio = [];
    
    if (filterValues.tiposCambio && Array.isArray(filterValues.tiposCambio)) {
      tiposCambio = filterValues.tiposCambio;
    } else if (searchResults?.listaTiposCambio && Array.isArray(searchResults.listaTiposCambio)) {
      tiposCambio = searchResults.listaTiposCambio;
    } else {
      // Dados de fallback para teste
      tiposCambio = [
        { id: 1, descricao: 'Manual' },
        { id: 2, descricao: 'Automático' },
        { id: 3, descricao: 'CVT' },
        { id: 4, descricao: 'Semi-automático' }
      ];
    }
    
    
    if (Array.isArray(tiposCambio) && tiposCambio.length > 0) {
      setOptions(tiposCambio);
    } else {
    }
  }, [filterValues.tiposCambio, searchResults?.listaTiposCambio]);

  // Carregar seleções existentes
  useEffect(() => {
    if (filterParams.tipos_cambio) {
      setSelectedGear(filterParams.tipos_cambio);
    }
  }, [filterParams.tipos_cambio]);

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
          <ScrollView style={{ maxHeight: 400 }}>
            {/* Lista de opções */}
            <Col style={{ marginVertical: 16 }}>
              {Array.isArray(options) && options.length > 0 ? (
                options.map(({ id, descricao }) => (
                  <TouchableOpacity
                    key={id}
                    onPress={() => handleToggle(id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      paddingVertical: 8,
                    }}
                  >
                    <Checkbox
                      disabled={false}
                      value={selectedGear.includes(id)}
                      onValueChange={() => handleToggle(id)}
                      color={theme.colors['brand-blue']}
                    />
                    <Text color="black-700">{descricao}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text color="black-500" fontStyle="p-16-regular">
                    Carregando opções...
                  </Text>
                </View>
              )}
            </Col>
          </ScrollView>
        );
      }}
    />
  );
};

export default GearFilter;
