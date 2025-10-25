import 'react-native-gesture-handler';

import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import { ThemeProvider } from 'styled-components/native';

import { AuthContextProvider } from '@contexts/AuthContext';
import { FiltersContextProvider } from '@contexts/FiltersContext';
import { HomeContextProvider } from '@contexts/HomeContext';
import { Routes } from './routes';
import { StyledThemeContainer, theme } from './theme/GlobalStyles';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

const LoadingIndicator = () => 
<View
  style={{
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: "#9A0B26"
  }}
>
  <ActivityIndicator />
</View>
;
const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Cabin: require('./assets/fonts/Cabin-Bold.ttf'),
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/fonts/Montserrat-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <LoadingIndicator />;
  }

  return (
    <PaperProvider>
      <ToastProvider textStyle={{ textAlign: 'center' }}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <HomeContextProvider>
                <FiltersContextProvider>
                  <StyledThemeContainer>
                    <NavigationContainer>
                      <Routes />
                      <StatusBar
                        barStyle="dark-content"
                        backgroundColor="transparent"
                        translucent
                      />
                    </NavigationContainer>
                  </StyledThemeContainer>
                </FiltersContextProvider>
              </HomeContextProvider>
            </AuthContextProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ToastProvider>
    </PaperProvider>
  );
}
