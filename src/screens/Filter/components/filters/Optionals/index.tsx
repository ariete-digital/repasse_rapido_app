import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import { GenericItem } from '@services/filters';
import { theme } from '@theme/GlobalStyles';
import BaseFilterModal from '../../BaseFilter';
import { AxiosResponse } from 'axios';
import { DataFetchProps } from '@lib/types';
import { api } from '@lib/api';

interface OptionalsFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const OptionalsFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: OptionalsFilterProps) => {
  const { searchResults, filterParams, setFilterParams, isLoading } =
    useFilters();
  const [selectedOptionals, setSelectedOptionals] = useState<number[]>([]);
  const [options, setOptions] = useState<GenericItem[]>(
    searchResults?.listaOpcionais || []
  );
  const [optionsInTwoColumns, setOptionsInTwoColumns] = useState<
    GenericItem[][]
  >([]);

  const handleToggle = (value: number) => {
    setSelectedOptionals((prevSelectedOptionals) => {
      if (prevSelectedOptionals.includes(value)) {
        return prevSelectedOptionals.filter((item) => item !== value);
      } else {
        return [...prevSelectedOptionals, value];
      }
    });
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, opcionais: selectedOptionals });
    handleConfirm();
  };

  const getOptionalsData = async () => {
    console.log('buscando opcionais');
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>(`cliente/listagem/opcionais`);

    // console.log('opcionais =', response.data.content);

    if (response.data.content) {
      setOptions(response.data.content);
    }
  };

  // useEffect(() => {
  //   getOptionalsData();
  // }, []);

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
      title="Opcionais"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <SafeAreaView style={{ height: 500, paddingVertical: 24 }}>
            <ScrollView>
              {optionsInTwoColumns.map((group, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                    gap: 5,
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
                          selectedOptionals.includes(id) ||
                          filterParams.opcionais?.includes(id)
                        }
                        onValueChange={() => handleToggle(id)}
                        color={theme.colors['brand-blue']}
                      />
                      <Text color="black-700">{descricao}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        );
      }}
    />
  );
};

export default OptionalsFilter;
