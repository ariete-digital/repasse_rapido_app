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
  AdvancedSearch,
  AnoContainer,
  Container,
  FilterContainer,
  Label,
  SearchButton,
  SearchButtonText,
  TabButton,
  TabButtonText,
  Tabs,
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

const optionsTipo = [
  { label: 'Carros / Caminhonetes', value: 'C' },
  { label: 'Motos', value: 'M' },
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
  const [activeTab, setActiveTab] = useState<'Veiculos' | 'Revendas'>(
    'Veiculos'
  );
  const [listaMarcas, setListaMarcas] = useState<OptionsList[]>([]);
  const [listaModelos, setListaModelos] = useState<OptionsList[]>([]);
  const [tipo, setTipo] = useState<string>();
  const [marca, setMarca] = useState<string>();
  const [modelo, setModelo] = useState<string>();
  const [anoMin, setAnoMin] = useState<string>();
  const [anoMax, setAnoMax] = useState<string>();
  const [listaLojas, setListaLojas] = useState<OptionsList[]>([]);
  const [listaCidades, setListaCidades] = useState<OptionsList[]>([]);
  const [cidade, setCidade] = useState<string>();
  const [loja, setLoja] = useState<string>();

  const handleSelectTipo = (option: { label: string; value: string }) => {
    // console.log('Selecionado:', option);
    setTipo(option.value);
  };

  const handleSelectMarca = (option: { label: string; value: string }) => {
    // console.log('Selecionado:', option);
    setMarca(option.value);
    getModelData(option.value);
  };

  const handleSelectCidade = (option: { label: string; value: string }) => {
    // console.log('Selecionado:', option);
    setCidade(option.value);
    getStoreData(option.value);
  };

  const getBrandData = async () => {
    // console.log('buscando marcas');
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>(
        `cliente/listagem/marcas?tipo_veiculo=${tipo}`
      );
    // console.log('marcas =', response.data.content);

    if (response.data.content) {
      setListaMarcas(response.data.content);
    }
  };

  const getModelData = async (id_marca?: string) => {
    // console.log('buscando marcas');
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>(
        `cliente/listagem/modelos?${id_marca ? `id_marca=${id_marca}` : ''}`
      );

    // console.log('modelos =', response.data.content);

    if (response.data.content) {
      setListaModelos(response.data.content);
    }
  };

  const getStoreData = async (id_cidade?: string) => {
    // console.log('buscando marcas');
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>(
        `cliente/lojas/filtrar?${id_cidade ? `id_cidade=${id_cidade}` : ''}`
      );
    // console.log('lojas =', response.data.content);

    if (response.data.content) {
      setListaLojas(
        response.data.content.lojas.map((l: any) => ({
          label: l.nome_fantasia,
          value: l.id,
        }))
      );
    }
  };

  const getCityData = async () => {
    // console.log('buscando cidades =', api.getUri());
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>(`cliente/listagem/cidades_cadastradas`);
    // console.log('cidades =', response.data.content);

    if (response.data.content) {
      setListaCidades(response.data.content);
    }
  };

  useEffect(() => {
    getBrandData();
  }, []);

  useEffect(() => {
    activeTab === 'Revendas' && listaCidades.length == 0 && getCityData();
  }, [activeTab]);

  const handleClickBuscar = () => {
    let filters = {};
    if (activeTab === 'Revendas') {
      filters = {
        cidade,
        loja,
        startSearch: true,
      };
    } else {
      filters = {
        tipo,
        marca,
        modelo,
        anoMin,
        anoMax,
        startSearch: true,
      };
    }
    navigation.navigate('search', {
      screen: 'filter',
      params: { filters },
    });
  };

  return (
    <Container>
      <FilterContainer>
        <Label>
        Encontre seu veículo
        </Label>
        <SearchableSelect
          placeholder="ESTADO"
          options={optionsTipo}
          onSelect={handleSelectTipo}
          selectedValue={tipo}
        />

        <SearchableSelect
          placeholder="MARCA/MODELO"
          options={listaModelos}
          onSelect={(selected) => setModelo(selected.value)}
          selectedValue={modelo}
        />

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
          <SearchButton
            onPress={handleClickBuscar}
          >
            <SearchButtonText>VER OFERTAS</SearchButtonText>
          </SearchButton>
        </View>
      </FilterContainer>

    </Container>
  );
}
