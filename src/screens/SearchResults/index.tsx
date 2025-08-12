import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';

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

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'search'>,
  NativeStackNavigationProp<SearchStackParamList>
>;

const SearchResults = () => {
  const [orderingOpen, setOrderingOpen] = useState(false);

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
          Ofertas (3501)
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
        <ItemCard
          key={"001"}
          itemID={1}
          imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
          brand={"Hyundai"}
          model={"HB20"}
          price={"100000"}
          fipePrice={"100000"}
          storeName={"Loja Teste Repasses"}
          description={"1.0 Comfort Style (Flex)"}
        />
        <ItemCard
          key={"001"}
          itemID={1}
          imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
          brand={"Hyundai"}
          model={"HB20"}
          price={"100000"}
          fipePrice={"100000"}
          storeName={"Loja Teste Repasses"}
          description={"1.0 Comfort Style (Flex)"}
        />
        <ItemCard
          key={"001"}
          itemID={1}
          imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
          brand={"Hyundai"}
          model={"HB20"}
          price={"100000"}
          fipePrice={"100000"}
          storeName={"Loja Teste Repasses"}
          description={"1.0 Comfort Style (Flex)"}
        />
        <ItemCard
          key={"001"}
          itemID={1}
          imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
          brand={"Hyundai"}
          model={"HB20"}
          price={"100000"}
          fipePrice={"100000"}
          storeName={"Loja Teste Repasses"}
          description={"1.0 Comfort Style (Flex)"}
        />
      </S.Container>
    </S.Wrapper>
  );
};

export default SearchResults;
