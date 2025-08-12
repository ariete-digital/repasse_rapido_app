import { Text } from '@components/index';
import checkIcon from '@icons/check.png';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@routes/app.routes';
import { Offer } from '@screens/Details/types';
import { Image } from 'react-native';
import * as O from './styles';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'moreInfo'
>;

const Optionals = (offer: Offer) => {
  const navigation = useNavigation<NavigationProps>();

  const goToMoreInfo = () => {
    navigation.navigate('moreInfo', offer);
  };

  return (
    <O.Container>
      <O.Header>
        <Text color="black-700" fontStyle="t-24">
          Opcionais
        </Text>
        <O.Pressable onPress={goToMoreInfo}>
          <Text color="brand-red" fontStyle="p-14-bold">MAIS INFORMAÇÕES {'>'}</Text>
        </O.Pressable>
      </O.Header>
      <O.Items>
        {offer.opcionais.map((item) => (
          <O.Item key={item.id}>
            <Image source={checkIcon} width={32} height={32} />
            <Text color="black-700" key={item.id} fontStyle="p-14-regular">
              {' '}
              {item.descricao}
            </Text>
          </O.Item>
        ))}
      </O.Items>
    </O.Container>
  );
};

export default Optionals;
