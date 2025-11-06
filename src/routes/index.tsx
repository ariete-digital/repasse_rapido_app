import { useAuth } from '@hooks/useAuth';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { ActivityIndicator, View, Image } from 'react-native';
import AppRoutes from './app.routes';
import logo from '../assets/images/logo2.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from './app.routes';

export const Routes = () => {
  const { isLoadingUserStorageData } = useAuth();

  // Configuração de linking para deeplinks
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
      'com.repasserapido.client://',
    ],
    config: {
      screens: {
        AppTabs: {
          screens: {
            home: 'home',
            search: 'search',
            sell: 'sell',
            contact: 'contact',
            menu: 'menu',
          },
        },
        adDetails: {
          path: 'anuncio/:code',
          parse: {
            code: (code: string) => code,
          },
        },
        auth: 'auth',
        myAccount: 'myAccount',
        manageAds: 'manageAds',
        viewPFAds: 'viewPFAds',
      },
    },
  };

  if (isLoadingUserStorageData) {
    return <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#9A0B26"
      }}
    >
      <Image
        style={{
          width: 280,
          height: 280
        }}
        source={logo}
        resizeMethod="auto"
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          bottom: 30
        }}
      >
        <ActivityIndicator
          color={"#fff"}
          size={30}
        />
      </View>
    </SafeAreaView>;
  }

  return (
    <NavigationContainer independent={true} linking={linking}>
      <AppRoutes />
    </NavigationContainer>
  );
};
