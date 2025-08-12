import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import { GenericItem } from '@services/filters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';
import { Row } from '../styles';

interface FuelTypeFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const FuelTypeFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: FuelTypeFilterProps) => {
  const { searchResults, filterParams, setFilterParams, isLoading } =
    useFilters();
  const [selectedFuelType, setSelectedFuelType] = useState<number[]>([]);
  const [options, setOptions] = useState<GenericItem[]>(
    searchResults?.listaTiposCombustivel || []
  );
  const [optionsInTwoColumns, setOptionsInTwoColumns] = useState<
    GenericItem[][]
  >([]);

  const handleToggle = (value: number) => {
    setSelectedFuelType((prevSelectedFuelType) => {
      if (prevSelectedFuelType.includes(value)) {
        return prevSelectedFuelType.filter((item) => item !== value);
      } else {
        return [...prevSelectedFuelType, value];
      }
    });
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, tipos_combustivel: selectedFuelType });
    handleConfirm();
  };

  useEffect(() => {
    const optInTwoColumns: GenericItem[][] = [];
    for (let i = 0; i < options.length; i += 2) {
      optInTwoColumns.push(options.slice(i, i + 2));
    }
    // console.log('optInTwoColumns =', optInTwoColumns);
    setOptionsInTwoColumns(optInTwoColumns);
  }, [options]);

  return (
    <BaseFilterModal
      title="Combustível"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <Row style={{ marginVertical: 16, flexWrap: 'wrap' }}>
            {optionsInTwoColumns.map((group, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  gap: 24,
                }}
              >
                {group.map(({ id, descricao }) => (
                  <View
                    key={id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Checkbox
                      disabled={false}
                      value={
                        selectedFuelType.includes(id) ||
                        filterParams.tipos_combustivel?.includes(id)
                      }
                      onValueChange={() => handleToggle(id)}
                      color={theme.colors['brand-blue']}
                    />
                    <Text color="black-700">{descricao}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Row>
        );
      }}
    />
  );
};

export default FuelTypeFilter;
