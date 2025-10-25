import { useAuth } from '@hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, Image } from 'react-native';
import AppRoutes from './app.routes';
import logo from '../assets/images/logo2.png';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Routes = () => {
  const { isLoadingUserStorageData } = useAuth();

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
    <NavigationContainer independent={true}>
      <AppRoutes />
    </NavigationContainer>
  );
};
