import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import { SearchStackParamList, RootTabParamList } from '@routes/app.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '@theme/GlobalStyles';
import {
  Brand,
  Colors,
  Doors,
  FuelType,
  Gear,
  Km,
  Location,
  Model,
  NewOrUsed,
  Optionals,
  Price,
  SellType,
  VehicleType,
  YearPicker,
} from './components/filters';
import { items } from './constants';
import * as F from './styles';
import { useQueryClient } from '@tanstack/react-query';
import { getFilteredData } from '@services/filters';
import BasicButton from '@components/BasicButton';

interface ItemProps {
  label: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  filterName: string;
  filterValue?: any;
  onRemoveFilter?: (filterType: string) => void;
}

const Item = ({ label, icon, onPress, filterName, filterValue, onRemoveFilter }: ItemProps) => {
  const getFilterDescription = () => {
    if (!filterValue) return null;

    switch (filterName) {
      case 'brands':
        return filterValue.marca ? `Marca: ${filterValue.marca}` : null;
      case 'models':
        return filterValue.modelo ? `Modelo: ${filterValue.modelo}` : null;
      case 'year':
        if (filterValue.ano?.min || filterValue.ano?.max) {
          const anoMin = filterValue.ano?.min || 'Qualquer';
          const anoMax = filterValue.ano?.max || 'Atual';
          return `Ano: ${anoMin} - ${anoMax}`;
        }
        return null;
      case 'price':
        if (filterValue.valor?.min || filterValue.valor?.max) {
          const valorMin = filterValue.valor?.min ? `R$ ${filterValue.valor.min.toLocaleString()}` : 'Qualquer';
          const valorMax = filterValue.valor?.max ? `R$ ${filterValue.valor.max.toLocaleString()}` : 'Qualquer';
          return `Valor: ${valorMin} - ${valorMax}`;
        }
        return null;
      case 'optionals':
        return filterValue.opcionais?.length ? `Opcionais: ${filterValue.opcionais.length} selecionados` : null;
      case 'transmissionType':
        
        return null;
      case 'fuelType':
        return filterValue.tipos_combustivel?.length ? `Combustível: ${filterValue.tipos_combustivel.length} selecionados` : null;
      case 'doorsQt':
        return filterValue.num_portas?.length ? `Portas: ${filterValue.num_portas.join(', ')}` : null;
      case 'colors':
        return filterValue.cor ? `Cor: ${filterValue.cor}` : null;
      case 'location':
        if (filterValue.id_cidade) {
          
          return (filterValue as any).cidade_nome ? `Cidade: ${(filterValue as any).cidade_nome}` : `Cidade selecionada`;
        }
        return null;
      default:
        return null;
    }
  };

  const filterDescription = getFilterDescription();

  return (
    <View>
      <F.Item onPress={onPress}>
        <F.Icon source={icon} />
        <Text color="black-700">{label}</Text>
      </F.Item>

      {filterDescription && (
        <View style={{ 
          paddingHorizontal: 30, 
          paddingVertical: 4,
          marginBottom: 8
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#E11138',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            alignSelf: 'flex-start',
            maxWidth: '80%'
          }}>
            <Text color="white" fontStyle="p-14-regular" style={{ flex: 1 }}>
              {filterDescription}
            </Text>
            <TouchableOpacity
              onPress={() => onRemoveFilter?.(filterName)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8
              }}
            >
              <Text color="white" fontStyle="p-10-bold">×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

type FilterScreenRouteProp = RouteProp<SearchStackParamList, 'filter'>;
type FilterScreenNavigationProp =
  NativeStackNavigationProp<SearchStackParamList>;

const Filter = () => {
  const toast = useToast();
  const navigation = useNavigation<FilterScreenNavigationProp>();
  const route = useRoute<FilterScreenRouteProp>();
  const queryClient = useQueryClient();
  const { filters } = route.params;
  const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false);

  const {
    searchResults,
    filterDataWithCount,
    refetchSearchResults,
    isLoading,
    resetFilters,
    isRefetching,
    setFilterParams,
    filterParams,
    filterValues,
  } = useFilters();

  const [currentFilter, setCurrentFilter] = useState('');
  const [preFilteredCount, setPreFilteredCount] = useState<number | null>(null);
  const [totalInicialAnuncios, setTotalInicialAnuncios] = useState<number>(0);

  const getTotalAnunciosFixo = () => {
    
    return totalInicialAnuncios || filterDataWithCount?.total || searchResults?.total || 0;
  };

  const getTotalAnunciosFiltrados = () => {
    
    if (preFilteredCount !== null) {
      return preFilteredCount;
    }
    
    return getTotalAnunciosFixo();
  };

  const getCambiosSelecionados = () => {
    if (!filterParams.tipos_cambio?.length) return [];

    const tiposCambio = filterValues.tiposCambio || searchResults?.listaTiposCambio || [];

    if (!Array.isArray(tiposCambio) || tiposCambio.length === 0) {
      
      const fallbackCambios = {
        1: 'Manual',
        2: 'Automático',
        3: 'CVT',
        4: 'Semi-automático',
        5: 'Automático Sequencial'
      };
      return filterParams.tipos_cambio.map(id => ({ 
        id, 
        nome: fallbackCambios[id as keyof typeof fallbackCambios] || `Câmbio ${id}` 
      }));
    }
    
    return filterParams.tipos_cambio.map(id => {
      const cambio = tiposCambio.find(c => c.id === id);
      return cambio ? { id, nome: cambio.descricao } : { id, nome: `Câmbio ${id}` };
    });
  };

  const removeCambio = (cambioId: number) => {
    const newParams = { ...filterParams };
    newParams.tipos_cambio = newParams.tipos_cambio?.filter(id => id !== cambioId);
    if (newParams.tipos_cambio?.length === 0) {
      delete newParams.tipos_cambio;
    }
    setFilterParams(newParams);
    toast.show('Câmbio removido!', { type: 'success' });
  };

  const hasActiveFilters = () => {
    const hasFilters = !!(
      filterParams.marca ||
      filterParams.modelo ||
      filterParams.id_marca ||
      filterParams.ano?.min ||
      filterParams.ano?.max ||
      filterParams.valor?.min ||
      filterParams.valor?.max ||
      filterParams.quilometragem?.min ||
      filterParams.quilometragem?.max ||
      filterParams.tipos_cambio?.length ||
      filterParams.tipos_combustivel?.length ||
      filterParams.num_portas?.length ||
      filterParams.cor ||
      filterParams.opcionais?.length ||
      filterParams.id_cidade ||
      filterParams.id_estado
    );

    return hasFilters;
  };

  const getActiveFiltersDescription = () => {
    const filters = [];
    
    if (filterParams.marca) {
      const marca = filterValues.brands?.find(b => String(b.value) === String(filterParams.marca));
      if (marca) filters.push({ text: `Marca: ${marca.label}`, type: 'marca' });
    }
    
    if (filterParams.modelo) {
      const modelo = filterValues.models?.find(m => String(m.value) === String(filterParams.modelo));
      if (modelo) filters.push({ text: `Modelo: ${modelo.label}`, type: 'modelo' });
    }
    
    if (filterParams.ano?.min || filterParams.ano?.max) {
      const anoMin = filterParams.ano?.min || 'Qualquer';
      const anoMax = filterParams.ano?.max || 'Atual';
      filters.push({ text: `Ano: ${anoMin} - ${anoMax}`, type: 'ano' });
    }
    
    if (filterParams.valor?.min || filterParams.valor?.max) {
      const valorMin = filterParams.valor?.min ? `R$ ${filterParams.valor.min.toLocaleString()}` : 'Qualquer';
      const valorMax = filterParams.valor?.max ? `R$ ${filterParams.valor.max.toLocaleString()}` : 'Qualquer';
      filters.push({ text: `Valor: ${valorMin} - ${valorMax}`, type: 'valor' });
    }
    
    if (filterParams.opcionais?.length) {
      const opcionais = filterParams.opcionais.map((id: number) => {
        
        const opcional = searchResults?.listaOpcionais?.find((o: any) => o.id === id);
        return opcional?.descricao || `Opcional ${id}`;
      });
      filters.push({ text: `Opcionais: ${opcionais.join(', ')}`, type: 'opcionais' });
    }
    
    if (filterParams.tipos_cambio?.length) {
      const cambios = filterParams.tipos_cambio.map(id => {
        const cambio = filterValues.tiposCambio?.find(c => c.id === id);
        return cambio?.descricao || `Câmbio ${id}`;
      });
      filters.push({ text: `Câmbio: ${cambios.join(', ')}`, type: 'cambio' });
    }
    
    if (filterParams.tipos_combustivel?.length) {
      const combustiveis = filterParams.tipos_combustivel.map(id => {
        const combustivel = filterValues.tiposCombustivel?.find(c => c.id === id);
        return combustivel?.descricao || `Combustível ${id}`;
      });
      filters.push({ text: `Combustível: ${combustiveis.join(', ')}`, type: 'combustivel' });
    }
    
    return filters;
  };

  const handleOpenModal = ({ filterName }: ItemProps) => {
    setCurrentFilter(filterName);
  };

  const handleConfirm = () => {
    setCurrentFilter('');
  };

  const handleCancel = () => {
    setCurrentFilter('');
  };

  const handleReset = () => {
    resetFilters('C');
    
    toast.show('Filtros redefinidos com sucesso!', { type: 'success' });
  };

  const removeFilter = (filterType: string) => {
    
    const newParams = { ...filterParams };
    
    switch (filterType) {
      case 'brands':
        delete newParams.marca;
        delete newParams.id_marca;
        break;
      case 'models':
        delete newParams.modelo;
        delete (newParams as any).id_modelo; 
        break;
      case 'year':
        delete newParams.ano;
        break;
      case 'price':
        delete newParams.valor;
        break;
      case 'optionals':
        delete newParams.opcionais;
        break;
      case 'transmissionType':
        delete newParams.tipos_cambio;
        break;
      case 'fuelType':
        delete newParams.tipos_combustivel;
        break;
      case 'doorsQt':
        delete newParams.num_portas;
        break;
      case 'colors':
        delete newParams.cor;
        break;
      case 'location':
        delete newParams.id_cidade;
        delete newParams.id_estado;
        delete newParams.cidade_nome;
        break;
    }

    const hasFilters = !!(
      newParams.marca ||
      newParams.modelo ||
      newParams.id_marca ||
      (newParams as any).id_modelo || 
      newParams.ano?.min ||
      newParams.ano?.max ||
      newParams.valor?.min ||
      newParams.valor?.max ||
      newParams.quilometragem?.min ||
      newParams.quilometragem?.max ||
      newParams.tipos_cambio?.length ||
      newParams.tipos_combustivel?.length ||
      newParams.num_portas?.length ||
      newParams.cor ||
      newParams.opcionais?.length ||
      newParams.id_cidade ||
      newParams.id_estado
    );

    setFilterParams(newParams);

    if (hasFilters) {
      preFilterSearchWithParams(newParams);
    } else {
      setPreFilteredCount(null);
    }
    
    toast.show('Filtro removido!', { type: 'success' });
  };

  const preFilterSearch = async () => {
    try {

      const result = await getFilteredData(filterParams);
      
      setPreFilteredCount(result.total);
    } catch (error) {
      setPreFilteredCount(null);
    }
  };

  const preFilterSearchWithParams = async (params: any) => {
    try {

      const undefinedFields = Object.keys(params).filter(key => params[key] === undefined);
      const nullFields = Object.keys(params).filter(key => params[key] === null);

      const cleanParams = { ...params };
      
      Object.keys(cleanParams).forEach(key => {
        if (cleanParams[key] === undefined) {
          delete cleanParams[key];
        }
      });

      const result = await getFilteredData(cleanParams);
      
      setPreFilteredCount(result.total);
    } catch (error) {
      setPreFilteredCount(null);
    }
  };

  const fetchSearch = async () => {
    const key = ['search-results', JSON.stringify(filterParams)];

    try {
      
      const result = await queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => getFilteredData(filterParams),
      });

      setPreFilteredCount(result.total);
      
      if (!isLoading) {
        navigation.navigate('searchScreen');
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (filters && filters.startSearch) {
      const newFilter: any = {
        tipo_veiculo: filters.tipo,
      };

      if (filters.marca) {
        newFilter.id_marca = parseInt(filters.marca);
        newFilter.marca = filters.marca_nome || filters.marca;
      }
      
      if (filters.modelo) {
        newFilter.id_modelo = parseInt(filters.modelo);
        newFilter.modelo = filters.modelo_nome || filters.modelo;
      }
      
      if (filters.anoMin || filters.anoMax) {
        newFilter.ano = {
          max: filters.anoMax ? parseInt(filters.anoMax) : undefined,
          min: filters.anoMin ? parseInt(filters.anoMin) : undefined,
        };
        
        if (newFilter.ano.max === undefined) delete newFilter.ano.max;
        if (newFilter.ano.min === undefined) delete newFilter.ano.min;
        
        if (Object.keys(newFilter.ano).length === 0) delete newFilter.ano;
      }
      
      if (filters.cidade) {
        newFilter.id_cidade = parseInt(filters.cidade);
        newFilter.cidade_nome = filters.cidade_nome;
      }
      
      if (filters.loja) {
        newFilter.id_loja = filters.loja;
      }
      
      setFilterParams(newFilter);
      setShouldTriggerSearch(true);
    }
  }, [filters]);

  useEffect(() => {
    if (shouldTriggerSearch) {
      fetchSearch();
      setShouldTriggerSearch(false); 
    }
  }, [shouldTriggerSearch]);

  useEffect(() => {
    if (!totalInicialAnuncios && (filterDataWithCount?.total || searchResults?.total)) {
      const totalInicial = filterDataWithCount?.total || searchResults?.total || 0;
      setTotalInicialAnuncios(totalInicial);
    }
  }, [filterDataWithCount?.total, searchResults?.total, totalInicialAnuncios]);

  useEffect(() => {
    
    if (hasActiveFilters()) {
      preFilterSearch();
    } else {
      setPreFilteredCount(null);
    }
  }, [filterParams]);

  return (
    <>
      <F.Container>
        <View style={{ paddingLeft: 30, paddingTop: 21, paddingBottom: 13, borderBottomColor: '#EBE8D9', borderBottomWidth: 1 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <Image source={require('@icons/arrow.png')} />
            <Text color="black" fontStyle="p-18-bold">
              Filtrar
            </Text>
          </Pressable>
        </View>
        
        <VehicleType
          isVisible={currentFilter === 'vehicleType'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <NewOrUsed
          isVisible={currentFilter === 'vehicleCurrentState'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <FuelType
          isVisible={currentFilter === 'fuelType'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Optionals
          isVisible={currentFilter === 'optionals'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Gear
          isVisible={currentFilter === 'transmissionType'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Doors
          isVisible={currentFilter === 'doorsQt'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <SellType
          isVisible={currentFilter === 'sellType'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <YearPicker
          isVisible={currentFilter === 'year'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Price
          isVisible={currentFilter === 'price'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Brand
          isVisible={currentFilter === 'brands'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Model
          isVisible={currentFilter === 'models'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Km
          isVisible={currentFilter === 'km'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Colors
          isVisible={currentFilter === 'colors'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Location
          isVisible={currentFilter === 'location'}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
        <Text
          color="black-700"
          fontStyle="t-24"
          style={{ fontWeight: 'bold' }}
          spacingY={16}
          spacingX={30}
        >
          Ofertas ({getTotalAnunciosFixo()})
        </Text>
        
        {items.map((item, idx) => (
          <Item 
            key={idx} 
            {...item} 
            onPress={() => handleOpenModal(item)} 
            filterValue={filterParams}
            onRemoveFilter={removeFilter}
          />
        ))}

        {getCambiosSelecionados().length > 0 && (
          <View style={{ paddingHorizontal: 30, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {getCambiosSelecionados().map((cambio) => (
                <View
                  key={cambio.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#E11138',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text color="white" fontStyle="p-14-regular">
                    {cambio.nome}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeCambio(cambio.id)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 8
                    }}
                  >
                    <Text color="white" fontStyle="p-10-bold">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <F.ButtonContainer>
          <BasicButton
            label={`Pesquisar (${getTotalAnunciosFiltrados()} anúncios)`}
            onPress={fetchSearch}
            disabled={isRefetching}
            backgroundColor='#9A0B26'
          />
        </F.ButtonContainer>
      </F.Container>
    </>
  );
};

export default Filter;
