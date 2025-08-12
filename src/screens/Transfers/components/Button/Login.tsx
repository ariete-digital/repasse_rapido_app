import { Image } from 'react-native';

import GradientButton from '@components/GradientButton';
import Text from '@components/Text';
import { useAuth } from '@hooks/useAuth';
import userIcon from '@icons/user.png';
import { useNavigation } from '@react-navigation/native';
import { LoginContainer } from './styles';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '@routes/app.routes';

type NavigationProps = BottomTabNavigationProp<RootTabParamList, 'auth'>;

const LoginButton = () => {
  const { signOut, user, setLoadTransfers } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  const handleLogin = () => {
    setLoadTransfers(true);
    if (user.access_token) {
      signOut();
    }
    navigation.navigate('auth');
  };
  return (
    <LoginContainer>
      <GradientButton onPress={handleLogin} paddingY={12}>
        <Image source={userIcon} />
        <Text color="white" fontStyle="p-14-bold">
          Entrar
        </Text>
      </GradientButton>
    </LoginContainer>
  );
};

export default LoginButton;
