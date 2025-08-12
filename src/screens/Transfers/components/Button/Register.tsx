import Text from '@components/Text';
import { useAuth } from '@hooks/useAuth';
import arrowUp from '@icons/arrow-up.png';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '@routes/app.routes';
import { Image } from 'react-native';
import { RegisterContainer } from './styles';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type NavigationProps = BottomTabNavigationProp<RootTabParamList, 'auth'>;

const RegisterButton = () => {
  const navigation = useNavigation<NavigationProps>();
  const { user, signOut } = useAuth();

  const handleRegister = () => {
    if (user.access_token) {
      signOut();
    }

    navigation.navigate('auth');
  };
  return (
    <RegisterContainer onPress={handleRegister}>
      <Image source={arrowUp} />
      <Text color="black" fontStyle="p-14-bold">
        Cadastrar
      </Text>
    </RegisterContainer>
  );
};

export default RegisterButton;
