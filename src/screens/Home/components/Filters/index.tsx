import SearchableSelect from '@components/SearchableSelect';
import { api } from '@lib/api';
import { DataFetchProps } from '@lib/types';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  AnoContainer,
  Container,
  FilterContainer,
  Label,
  RowContainer,
  SearchButton,
  SearchButtonText,
} from './styles';
import GradientButton from '@components/GradientButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList, SearchStackParamList } from '@routes/app.routes';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type OptionsList = {
  label: string;
  value: string;
};

const optionsEstado = [
  { label: 'São Paulo', value: 'SP' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Pernambuco', value: 'PE' },
];

const currentYear = new Date().getFullYear();

const yearOptions: OptionsList[] = Array.from(
  { length: currentYear - 1940 + 1 },
  (_, i) => {
    const year = (currentYear - i).toString();
    return { label: year, value: year };
  }
);

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'search'>,
  NativeStackNavigationProp<SearchStackParamList>
>;

export default function Filters() {
  const navigation = useNavigation<NavigationProps>();
  const [listaMarcas, setListaMarcas] = useState<OptionsList[]>([]);
  const [listaModelos, setListaModelos] = useState<OptionsList[]>([]);
  const [estado, setEstado] = useState<string>();
  const [marca, setMarca] = useState<string>();
  const [modelo, setModelo] = useState<string>();
  const [anoMin, setAnoMin] = useState<string>();
  const [anoMax, setAnoMax] = useState<string>();

  const handleSelectEstado = (option: { label: string; value: string }) => {
    // console.log('Selecionado:', option);
    setEstado(option.value);
    // Limpar seleções dependentes quando mudar o estado
    setMarca(undefined);
    setModelo(undefined);
    setListaModelos([]);
    // Recarregar marcas para o novo estado
    getBrandData(option.value);
  };

  const handleSelectMarca = (option: { label: string; value: string }) => {
    // console.log('Selecionado:', option);
    setMarca(option.value);
    // Limpar modelo selecionado quando mudar marca
    setModelo(undefined);
    getModelData(option.value);
  };


  const getBrandData = async (estadoParam?: string) => {
    try {
      const estadoToUse = estadoParam || estado;
      // console.log('buscando marcas para estado:', estadoToUse);
      const response: AxiosResponse<DataFetchProps> =
        await api.get<DataFetchProps>(
          `cliente/listagem/marcas?estado=${estadoToUse}`
        );
      // console.log('marcas =', response.data.content);

      if (response.data.content) {
        setListaMarcas(response.data.content);
      }
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      setListaMarcas([]);
    }
  };

  const getModelData = async (id_marca?: string) => {
    try {
      if (!id_marca) {
        setListaModelos([]);
        return;
      }
      
      // console.log('buscando modelos para marca:', id_marca);
      const response: AxiosResponse<DataFetchProps> =
        await api.get<DataFetchProps>(
          `cliente/listagem/modelos?id_marca=${id_marca}`
        );

      // console.log('modelos =', response.data.content);

      if (response.data.content) {
        setListaModelos(response.data.content);
      }
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      setListaModelos([]);
    }
  };


  useEffect(() => {
    // Carregar marcas iniciais
    getBrandData();
  }, []);


  const handleClickBuscar = () => {
    const filters = {
      estado,
      marca,
      modelo,
      anoMin,
      anoMax,
      startSearch: true,
    };
    navigation.navigate('search', {
      screen: 'filter',
      params: { filters },
    });
  };

  return (
    <Container>
      <FilterContainer>
        <Label>Encontre seu veículo</Label>
        
        <SearchableSelect
          placeholder="ESTADO"
          options={optionsEstado}
          onSelect={handleSelectEstado}
          selectedValue={estado}
        />

        <RowContainer>
          <SearchableSelect
            placeholder="MARCA"
            options={listaMarcas}
            onSelect={handleSelectMarca}
            selectedValue={marca}
          />
          <SearchableSelect
            placeholder="MODELO"
            options={listaModelos}
            onSelect={(selected) => setModelo(selected.value)}
            selectedValue={modelo}
          />
        </RowContainer>

        <AnoContainer>
          <SearchableSelect
            placeholder="ANO INICIAL"
            options={yearOptions}
            onSelect={(selected) => setAnoMin(selected.value)}
            selectedValue={anoMin}
          />
          <SearchableSelect
            placeholder="ANO FINAL"
            options={yearOptions}
            onSelect={(selected) => setAnoMax(selected.value)}
            selectedValue={anoMax}
          />
        </AnoContainer>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SearchButton onPress={handleClickBuscar}>
            <SearchButtonText>VER OFERTAS</SearchButtonText>
          </SearchButton>
        </View>
      </FilterContainer>

    </Container>
  );
}
