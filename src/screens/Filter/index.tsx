import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, View } from 'react-native';
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
}

const Item = ({ label, icon, onPress }: ItemProps) => {
  return (
    <F.Item onPress={onPress}>
      <F.Icon source={icon} />
      <Text color="black-700">{label}</Text>
    </F.Item>
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
  // console.log('route.params =', route.params);
  const { filters } = route.params;
  const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false);

  const {
    searchResults,
    refetchSearchResults,
    isLoading,
    resetFilters,
    isRefetching,
    setFilterParams,
    filterParams,
  } = useFilters();

  const [currentFilter, setCurrentFilter] = useState('');

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
    // fetchSearch();
    toast.show('Filtros redefinidos com sucesso!', { type: 'success' });
  };

  const fetchSearch = async () => {
    // console.log('fetchSearch');
    const key = ['search-results', JSON.stringify(filterParams)];

    queryClient.fetchQuery({
      queryKey: key,
      queryFn: () => getFilteredData(filterParams),
    });
    // console.log('retorno =', retorno);
    if (!isLoading) {
      navigation.navigate('searchScreen');
    }
  };

  useEffect(() => {
    // console.log('filters =', filters);
    if (filters && filters.startSearch) {
      const newFilter = {
        tipo_veiculo: filters.tipo,
        id_marca: filters.marca,
        id_modelo: filters.modelo,
        ano: {
          max: filters.anoMax,
          min: filters.anoMin,
        },
        status_veiculo: 'U' as 'U',
        id_loja: filters.loja,
        id_cidade: filters.cidade,
      };
      // console.log('newFilter =', newFilter);
      setFilterParams(newFilter);
      setShouldTriggerSearch(true);
    }
  }, [filters]);

  useEffect(() => {
    if (shouldTriggerSearch) {
      fetchSearch();
      setShouldTriggerSearch(false); // evita chamadas duplas
    }
  }, [shouldTriggerSearch]);

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
        {/* <F.ButtonContainer>
          <GradientButton
            onPress={handleReset}
            paddingY={16}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <ActivityIndicator />
            ) : (
              <>
                <MaterialIcons
                  name="delete"
                  color={theme.colors.white}
                  size={24}
                />
                <Text color="white">Clique aqui para limpar os filtros</Text>
              </>
            )}
          </GradientButton>
        </F.ButtonContainer> */}
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
          Ofertas (3501)
        </Text>
        {items.map((item, idx) => (
          <Item key={idx} {...item} onPress={() => handleOpenModal(item)} />
        ))}
        <F.ButtonContainer>
          <BasicButton
            label={`Pesquisar (343 anúncios)`}
            onPress={handleReset}
            disabled={isRefetching}
            backgroundColor='#9A0B26'
          />
        </F.ButtonContainer>
      </F.Container>
    </>
  );
};

export default Filter;
