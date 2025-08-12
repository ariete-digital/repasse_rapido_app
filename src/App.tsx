import 'react-native-gesture-handler';

import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StatusBar } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import { ThemeProvider } from 'styled-components/native';

import { AuthContextProvider } from '@contexts/AuthContext';
import { FiltersContextProvider } from '@contexts/FiltersContext';
import { HomeContextProvider } from '@contexts/HomeContext';
import { Routes } from './routes';
import { StyledThemeContainer, theme } from './theme/GlobalStyles';

const LoadingIndicator = () => <ActivityIndicator />;
const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Cabin: require('./assets/fonts/Cabin-Bold.ttf'),
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/fonts/Montserrat-Bold.ttf'),
  });

  if (!fontsLoaded) {
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
