import React, { useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    
    if (!user || !user.id) {
      // @ts-ignore - navigation type
      navigation.navigate('auth', { screen: 'login' });
    }
  }, [user, navigation]);

  if (!user || !user.id) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

