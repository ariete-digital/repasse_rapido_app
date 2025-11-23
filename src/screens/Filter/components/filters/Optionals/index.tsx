import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';

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
  const { searchResults, filterParams, setFilterParams, isLoading, filterValues } =
    useFilters();
  const [selectedOptionals, setSelectedOptionals] = useState<number[]>([]);
  const [options, setOptions] = useState<GenericItem[]>(
    searchResults?.listaOpcionais || filterValues.opcionais || []
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
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>(`cliente/listagem/opcionais`);

    if (response.data.content) {
      setOptions(response.data.content);
    }
  };

  useEffect(() => {
    if (filterParams.opcionais) {
      setSelectedOptionals(filterParams.opcionais);
    }
  }, [filterParams.opcionais]);

  useEffect(() => {
    const optInTwoColumns: GenericItem[][] = [];
    for (let i = 0; i < options.length; i += 2) {
      optInTwoColumns.push(options.slice(i, i + 2));
    }
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
              
              {selectedOptionals.length > 0 && (
                <View style={{ padding: 10, marginBottom: 20 }}>
                  <Text color="black-700" fontStyle="p-16-bold" style={{ marginBottom: 10 }}>
                    Opcionais Selecionados:
                  </Text>
                  {selectedOptionals.map((optionalId) => {
                    const optional = options.find(opt => opt.id === optionalId);
                    return optional ? (
                      <View key={optionalId} style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                        padding: 10,
                        marginBottom: 5,
                        borderRadius: 5
                      }}>
                        <Text color="black-700" fontStyle="p-14-regular">
                          {optional.descricao}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleToggle(optionalId)}
                          style={{
                            backgroundColor: '#E11138',
                            borderRadius: 15,
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Text color="white" fontStyle="p-12-bold">×</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null;
                  })}
                </View>
              )}

              <View style={{ padding: 10 }}>
                <Text color="black-700" fontStyle="p-16-bold" style={{ marginBottom: 10 }}>
                  Opcionais Disponíveis:
                </Text>
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
                          value={selectedOptionals.includes(id)}
                          onValueChange={() => handleToggle(id)}
                          color={theme.colors['brand-blue']}
                        />
                        <Text color="black-700">{descricao}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    />
  );
};

export default OptionalsFilter;
