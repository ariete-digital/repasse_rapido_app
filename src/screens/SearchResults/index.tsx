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

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'search'>,
  NativeStackNavigationProp<SearchStackParamList>
>;

const SearchResults = () => {
  const [orderingOpen, setOrderingOpen] = useState(false);
  const { searchResults, isSearchResultsLoading, isRefetching } = useFilters();

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
  const getImageUrl = (imagens: any) => {
    if (!imagens || imagens.length === 0) return undefined;
    const firstImage = imagens[0];
    if (typeof firstImage === 'string') return firstImage;
    return firstImage.link || firstImage.arquivo || undefined;
  };

  const renderAds = () => {
    if (isSearchResultsLoading || isRefetching) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <ActivityIndicator size="large" color="#E11138" />
        </View>
      );
    }

    if (!searchResults?.anuncios || searchResults.anuncios.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <Text color="black-500" fontStyle="p-18-regular">
            Nenhum anúncio encontrado
          </Text>
        </View>
      );
    }

    return searchResults.anuncios.map((ad) => (
      <ItemCard
        key={ad.codigo}
        itemID={ad.id}
        imageUrl={getImageUrl(ad.imagens)}
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
          Ofertas ({searchResults?.total || 0})
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
          <Image source={Filter} />
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
