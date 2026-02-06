import { TouchableOpacity } from 'react-native';
import { PersonIcon, LogoutIcon } from '@components/CustomIcons';

import HeaderLogo from '@components/HeaderLogo';
import { useAuth } from '@hooks/useAuth';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootTabParamList } from '@routes/app.routes';
import { useToast } from 'react-native-toast-notifications';
import * as H from './styles';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HeaderUserRow() {
  const { signOut, user } = useAuth();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();

  const showAppVersion = () => {
    const version =
      Constants.expoConfig?.version ||
      // fallback for older manifest shapes / edge cases
      // @ts-ignore
      Constants.manifest?.version ||
      'unknown';

    toast.show(`Current app version: v${version}`, { type: 'warning' });
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
        {user.access_token ? (
          <LogoutIcon size={22} color="#fff" />
        ) : (
          <PersonIcon size={22} color="#fff" />
        )}
      </TouchableOpacity>
    </H.Container>
  );
}
