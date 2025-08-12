import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import HeaderLogo from '@components/HeaderLogo';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '@routes/app.routes';
import { theme } from '@theme/GlobalStyles';
import { useToast } from 'react-native-toast-notifications';
import { expo } from '../../../../../app.json';
import * as H from './styles';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type NavigationProps = BottomTabNavigationProp<RootTabParamList, 'auth'>;

export default function HeaderUserRow() {
  const { signOut, user } = useAuth();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();

  const showAppVersion = () => {
    toast.show(`Current app version: v${expo.version}`, { type: 'warning' });
  };

  const handleButtonAction = () => {
    if (user.access_token) {
      signOut();
      return;
    }

    if (!user.access_token) {
      navigation.navigate('auth');
    }
  };

  return (
    <H.Container>
      <HeaderLogo />
      <TouchableOpacity
        onPress={handleButtonAction}
        onLongPress={showAppVersion}
        style={{
          position: 'absolute',
          right: 25,
          backgroundColor: "#9A0B26",
          borderRadius: 100,
          padding: 6,
        }}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name={user.access_token ? 'logout' : 'person'}
          size={22}
          color={"#fff"}
        />
      </TouchableOpacity>
    </H.Container>
  );
}
