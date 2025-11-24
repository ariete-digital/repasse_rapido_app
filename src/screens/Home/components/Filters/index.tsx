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
import { useFilters } from '@hooks/useFilters';

type OptionsList = {
  label: string;
  value: string;
};

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
  const { setFilterParams } = useFilters();
  const [listaMarcas, setListaMarcas] = useState<OptionsList[]>([]);
  const [listaModelos, setListaModelos] = useState<OptionsList[]>([]);
  const [listaCidades, setListaCidades] = useState<OptionsList[]>([]);
  const [cidade, setCidade] = useState<string>();
  const [marca, setMarca] = useState<string>();
  const [modelo, setModelo] = useState<string>();
  const [anoMin, setAnoMin] = useState<string>();
  const [anoMax, setAnoMax] = useState<string>();
  const [loadingCidades, setLoadingCidades] = useState(false);

  const handleSelectCidade = (option: { label: string; value: string }) => {
    setCidade(option.value);
    
    setMarca(undefined);
    setModelo(undefined);
    setListaModelos([]);
    
    getBrandData(option.value);
  };

  const handleSelectMarca = (option: { label: string; value: string }) => {
    setMarca(option.value);
    
    // Limpar modelo e lista de modelos
    setModelo(undefined);
    setListaModelos([]);
    getModelData(option.value);
  };

  const getBrandData = async (cidadeParam?: string) => {
    try {
      const cidadeToUse = cidadeParam || cidade;

      let endpoints = [];
      
      if (cidadeToUse) {
        endpoints.push(`cliente/listagem/marcas?cidade=${cidadeToUse}`);
      }
      endpoints.push('cliente/listagem/marcas?filtro=');
      endpoints.push('cliente/listagem/marcas');

      for (const endpoint of endpoints) {
        try {
          const response: AxiosResponse<DataFetchProps> =
            await api.get<DataFetchProps>(endpoint);

          if (response.data.content && Array.isArray(response.data.content)) {

            const marcasValidas = response.data.content.filter(marca => 
              marca && typeof marca === 'object' && 
              marca.value && marca.label
            );

            if (marcasValidas.length > 0) {
              setListaMarcas(marcasValidas);
              return; 
            }
          }
        } catch (endpointError) {
          continue; 
        }
      }
      
      setListaMarcas([]);
    } catch (error) {
      setListaMarcas([]);
    }
  };

  const getCityData = async (query: string) => {
    try {
      // Se o usuário apagou tudo, limpar a seleção de cidade
      if (query.length === 0) {
        setCidade(undefined);
        setListaCidades([]);
        return;
      }

      if (query.length < 3) {
        setListaCidades([]);
        return;
      }
      
      setLoadingCidades(true);
      
      const response: AxiosResponse<DataFetchProps> =
        await api.get<DataFetchProps>(`cliente/listagem/cidades?filtro=${query}`);

      if (response.data.content && Array.isArray(response.data.content)) {
        const cidadesFormatadas = response.data.content.map(cidade => ({
          label: cidade.label,
          value: cidade.value.toString()
        }));
        setListaCidades(cidadesFormatadas);
      } else {
        setListaCidades([]);
      }
    } catch (error) {
      setListaCidades([]);
    } finally {
      setLoadingCidades(false);
    }
  };

  const loadIncrementalCities = async (filter: string) => {
    try {
      setLoadingCidades(true);
      
      const response: AxiosResponse<DataFetchProps> =
        await api.get<DataFetchProps>(`cliente/listagem/cidades?filtro=${filter}`);

      if (response.data.content && Array.isArray(response.data.content)) {
        const cidadesFormatadas = response.data.content.map(cidade => ({
          label: cidade.label,
          value: cidade.value.toString()
        }));
        
        // Acumular resultados, evitando duplicatas
        setListaCidades(prev => {
          const existingValues = new Set(prev.map(c => c.value));
          const newCidades = cidadesFormatadas.filter(c => !existingValues.has(c.value));
          return [...prev, ...newCidades].sort((a, b) => a.label.localeCompare(b.label));
        });
      }
    } catch (error) {
      // Não limpar a lista em caso de erro no carregamento incremental
    } finally {
      setLoadingCidades(false);
    }
  };

  const getModelData = async (id_marca?: string) => {
    try {
      if (!id_marca) {
        setListaModelos([]);
        return;
      }
      
      const response: AxiosResponse<DataFetchProps> =
        await api.get<DataFetchProps>(
          `cliente/listagem/modelos?id_marca=${id_marca}`
        );

      if (response.data.content) {
        setListaModelos(response.data.content);
      }
    } catch (error) {
      setListaModelos([]);
    }
  };

  useEffect(() => {
    getBrandData();
  }, []);

  const handleClickBuscar = () => {

    const filterParams: any = {};
    
    if (cidade) {
      filterParams.id_cidade = parseInt(cidade);
      
      const cidadeSelecionada = listaCidades.find(c => c.value === cidade);
      if (cidadeSelecionada) {
        filterParams.cidade_nome = cidadeSelecionada.label;
      }
    }
    if (marca) {
      filterParams.id_marca = parseInt(marca);
    }
    if (modelo) {
      filterParams.modelo = modelo;
    }
    if (anoMin) {
      filterParams.ano = { ...filterParams.ano, min: parseInt(anoMin) };
    }
    if (anoMax) {
      filterParams.ano = { ...filterParams.ano, max: parseInt(anoMax) };
    }

    if (Object.keys(filterParams).length > 0) {
      setFilterParams(filterParams);
    }

    const marcaSelecionada = listaMarcas.find(m => m.value === marca);
    const modeloSelecionado = listaModelos.find(m => m.value === modelo);
    
    const filtersToSend = {
      startSearch: true,
      tipo: 'C', 
      marca: marca,
      modelo: modelo,
      marca_nome: marcaSelecionada?.label,
      modelo_nome: modeloSelecionado?.label,
      anoMin: anoMin,
      anoMax: anoMax,
      cidade: cidade,
      cidade_nome: filterParams.cidade_nome,
    };

    navigation.navigate('search', {
      screen: 'filter',
      params: { 
        filters: filtersToSend
      }
    });
  };

  return (
    <Container>
      <FilterContainer>
        <Label>Encontre seu veículo</Label>
        
        <SearchableSelect
          placeholder="CIDADE"
          options={listaCidades}
          onSelect={handleSelectCidade}
          selectedValue={cidade}
          onInputChange={getCityData}
          onIncrementalLoad={loadIncrementalCities}
          isLoading={loadingCidades}
          enableIncrementalLoading={true}
          showChevron={false}
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
            disabled={!marca}
          />
        </RowContainer>

        <AnoContainer>
          <SearchableSelect
            placeholder="ANO INICIAL"
            options={
              anoMax
                ? yearOptions.filter((year) => parseInt(year.value) <= parseInt(anoMax))
                : yearOptions
            }
            onSelect={(selected) => {
              setAnoMin(selected.value);
              // Se ano final existe e é menor que o inicial, limpar ano final
              if (anoMax && parseInt(anoMax) < parseInt(selected.value)) {
                setAnoMax(undefined);
              }
            }}
            selectedValue={anoMin}
          />
          <SearchableSelect
            placeholder="ANO FINAL"
            options={
              anoMin
                ? yearOptions.filter((year) => parseInt(year.value) >= parseInt(anoMin))
                : yearOptions
            }
            onSelect={(selected) => {
              setAnoMax(selected.value);
              // Se ano inicial existe e é maior que o final, limpar ano inicial
              if (anoMin && parseInt(anoMin) > parseInt(selected.value)) {
                setAnoMin(undefined);
              }
            }}
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
