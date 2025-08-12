import { useAuth } from '@hooks/useAuth';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import AppRoutes from './app.routes';

export const Routes = () => {
  const { isLoadingUserStorageData } = useAuth();

  if (isLoadingUserStorageData) {
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer independent={true}>
      <AppRoutes />
    </NavigationContainer>
  );
};
