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
    // Verifica se o usuário não está logado
    if (!user || !user.id) {
      // @ts-ignore - navigation type
      navigation.navigate('auth', { screen: 'login' });
    }
  }, [user, navigation]);

  // Se não estiver logado, não renderiza nada (já redirecionou)
  if (!user || !user.id) {
    return null;
  }

  // Se estiver logado, renderiza o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;

