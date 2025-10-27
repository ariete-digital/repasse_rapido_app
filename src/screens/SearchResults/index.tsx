import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';

import Text from '@components/Text';
import { ArrowOrder, Filter } from '@icons/index';
import { RootTabParamList, SearchStackParamList } from '@routes/app.routes';
import {
  CommonActions,
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Order } from '@screens/Filter/components/filters';
import * as S from './styles';
import ItemCard from '@components/ItemCard';
import { useFilters } from '@hooks/useFilters';
import { FilterOptions } from '@services/filters';

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'search'>,
  NativeStackNavigationProp<SearchStackParamList>
>;

const SearchResults = () => {
  const [orderingOpen, setOrderingOpen] = useState(false);
  const { searchResults, filterDataWithCount, isSearchResultsLoading, isRefetching, filterParams } = useFilters();

  // Função para verificar se há filtros ativos
  const hasActiveFilters = (filters: FilterOptions): boolean => {
    // Verificar filtros básicos
    if (filters.id_cidade || filters.cidade_nome) return true;
    if (filters.id_marca || filters.marca) return true;
    if (filters.modelo) return true;
    if (filters.id_estado) return true;
    
    // Verificar filtros de ano
    if (filters.ano?.min || filters.ano?.max) return true;
    
    // Verificar filtros de valor
    if (filters.valor?.min || filters.valor?.max) return true;
    
    // Verificar filtros de quilometragem (se existir na interface)
    // if (filters.km?.min || filters.km?.max) return true;
    
    // Verificar filtros de opcionais
    if (filters.opcionais && filters.opcionais.length > 0) return true;
    
    // Verificar filtros de câmbio
    if (filters.tipos_cambio && filters.tipos_cambio.length > 0) return true;
    
    // Verificar filtros de combustível
    if (filters.tipos_combustivel && filters.tipos_combustivel.length > 0) return true;
    
    // Verificar filtros de cor
    if (filters.cores && filters.cores.length > 0) return true;
    
    // Verificar filtros de portas
    if (filters.num_portas && filters.num_portas.length > 0) return true;
    
    // Verificar filtros de status
    if (filters.status_veiculo) return true;
    
    return false;
  };

  const handleConfirm = () => {
    toggleOrderingModal();
    // setShouldTriggerSearch(true);
  };

  const handleCancel = () => {
    toggleOrderingModal();
  };

  const navigation = useNavigation<NavigationProps>();

  const goToFilter = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'search',
        params: {
          screen: 'filter',
          params: { filters: {} },
          state: {
            routes: [
              { name: 'searchScreen' },
              { name: 'filter', params: { filters: {} } },
            ],
          },
        },
      })
    );
  };

  const toggleOrderingModal = () => {
    setOrderingOpen(!orderingOpen);
  };

  // Helper function to get image URL
  const getImageUrl = (ad: any) => {
    // Primeiro, verificar se há imagemPrincipal
    if (ad.imagemPrincipal) {
      return ad.imagemPrincipal;
    }
    
    // Depois, verificar se há array de imagens
    if (ad.imagens && ad.imagens.length > 0) {
      const firstImage = ad.imagens[0];
      if (typeof firstImage === 'string') return firstImage;
      return firstImage.link || firstImage.arquivo || undefined;
    }
    
    return undefined;
  };

  const renderAds = () => {
    if (isSearchResultsLoading || isRefetching) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <ActivityIndicator size="large" color="#E11138" />
        </View>
      );
    }

    const anuncios = filterDataWithCount?.anuncios || searchResults?.anuncios || [];
    
    if (!anuncios || anuncios.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <Text color="black-500" fontStyle="p-18-regular">
            Nenhum anúncio encontrado
          </Text>
        </View>
      );
    }

    return anuncios.map((ad) => (
      <ItemCard
        key={ad.codigo}
        itemID={ad.id}
        codigo={ad.codigo}
        imageUrl={getImageUrl(ad)}
        brand={ad.marca_veiculo}
        model={ad.modelo_veiculo}
        price={ad.valor ? ad.valor.toString() : '0'}
        fipePrice={ad.valor_fipe ? ad.valor_fipe.toString() : '0'}
        storeName={ad.cliente?.nome || 'Anunciante'}
        description={ad.submodelo || ''}
        isVendido={!!ad.vendido_em}
      />
    ));
  };

  return (
    <S.Wrapper>
      <View style={{ paddingLeft: 30, paddingTop: 21, paddingBottom: 13, borderBottomColor: '#EBE8D9', borderBottomWidth: 1 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <Image source={require('@icons/arrow.png')} />
          <Text color="black" fontStyle="p-18-bold">
            Voltar
          </Text>
        </Pressable>
      </View>
      <Order
        isVisible={orderingOpen}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />
      <View style={{ paddingLeft: 30, paddingTop: 20 }}>
        <Text color="black" fontStyle="t-24" style={{ fontWeight: 'bold' }}>
          Ofertas ({filterDataWithCount?.total || searchResults?.total || 0})
        </Text>
      </View>
      <S.HeaderButtonsRow>
        <S.Pressable onPress={toggleOrderingModal}>
          <Image source={ArrowOrder} />
          <Text color="black" fontStyle="p-18-regular">
            Ordenar
          </Text>
        </S.Pressable>
        <S.Pressable onPress={goToFilter}>
          <View style={{ position: 'relative' }}>
            <Image source={Filter} />
            {hasActiveFilters(filterParams) && (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#E11138',
                  borderWidth: 2,
                  borderColor: 'white',
                }}
              />
            )}
          </View>
          <Text color="black" fontStyle="p-18-regular">
            Filtrar
          </Text>
        </S.Pressable>
      </S.HeaderButtonsRow>
      <S.Container>
        {renderAds()}
      </S.Container>
    </S.Wrapper>
  );
};

export default SearchResults;
