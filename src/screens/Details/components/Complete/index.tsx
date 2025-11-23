import Text from '@components/Text';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SearchStackParamList } from '@routes/app.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Offer } from '@screens/Details/types';
import { TouchableOpacity } from 'react-native';
import * as C from './styles';

type NavigationProps = NativeStackNavigationProp<
  SearchStackParamList,
  'specifications'
>;

const CompleteDetails = (offer: Offer) => {
  const navigation = useNavigation<NavigationProps>();

  const goToSpecs = () => {
    
    navigation.dispatch(
      CommonActions.navigate({
        name: 'search',
        params: {
          screen: 'specifications',
          params: offer,
          state: {
            routes: [
              { name: 'searchScreen' },
              { name: 'adDetails', params: { code: offer.codigo } },
              { name: 'specifications', params: offer },
            ],
          },
        },
      })
    );
  };

  return (
    <C.Container>
      <TouchableOpacity onPress={goToSpecs}>
        <Text color="brand-red">VER FICHA TÉCNICA COMPLETA {'>'}</Text>
      </TouchableOpacity>
    </C.Container>
  );
};

export default CompleteDetails;
