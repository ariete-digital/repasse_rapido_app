import GradientButton from '@components/GradientButton';
import Text from '@components/Text';
import { Calendar, Speedometer } from '@icons/index';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParamList } from '@routes/app.routes';
import { OfferHead } from '@screens/Details/components';
import { Offer } from '@screens/Details/types';
import { Image, View } from 'react-native';
import { Container, IconRow, Item } from './styles';

type NavigationProps = NativeStackNavigationProp<
  SearchStackParamList,
  'adDetails'
>;

const ItemCard = (data: Offer) => {
  const navigation = useNavigation<NavigationProps>();

  const seeOffer = () => {
    navigation.navigate('adDetails', { code: data.codigo });
  };

  return (
    <Container>
      <Image
        resizeMode="center"
        source={{ uri: data.imagemPrincipal }}
        style={{ width: '100%', height: 250 }}
      />
      <OfferHead {...data} />
      <IconRow>
        <Item>
          <Image source={Calendar} />
          <Text color="black">
            {data.ano_fabricacao + ' | ' + data.ano_modelo}
          </Text>
        </Item>
        <Item>
          <Image source={Speedometer} />
          <Text color="black">{data.quilometragem}Km</Text>
        </Item>
      </IconRow>
      <View style={{ padding: 8, width: '90%' }}>
        <GradientButton onPress={seeOffer} label="Saiba Mais" paddingY={12} />
      </View>
    </Container>
  );
};

export default ItemCard;
