import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import EditLegal from './components/EditLegal';
import EditIndividual from './components/EditIndividual';
import EditAutonomo from './components/EditAutonomo';
import { SvgXml } from 'react-native-svg';
import { PersonIcon } from '@icons/PersonIcon';
import PageScaffold from '@components/PageScaffold';
import { useAuth } from '@hooks/useAuth';
import { api } from '@lib/api';
import { useToast } from 'react-native-toast-notifications';
import { UserDTO } from '@lib/storage/storageUser';
import Text from '@components/Text';

const MyAccount = () => {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cliente/minha_conta/obter');

      if (response.data && response.data.content) {
        
        const clienteData = response.data.content.cliente;
        if (clienteData) {
          setUserData(clienteData);
        }
      }
    } catch (error: any) {
      toast.show('Erro ao carregar dados do usuário', { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditForm = () => {
    if (!userData) return null;

    switch (userData.tipo) {
      case 'PF':
        return <EditIndividual userData={userData} onUpdate={loadUserData} />;
      case 'PJ':
        return <EditLegal userData={userData} onUpdate={loadUserData} />;
      case 'A':
        return <EditAutonomo userData={userData} onUpdate={loadUserData} />;
      default:
        return (
          <Text color="black" fontStyle="p-16-regular">
            Tipo de usuário não reconhecido
          </Text>
        );
    }
  };

  if (isLoading) {
    return (
      <PageScaffold
        titleText={'Minha Conta'}
        titleIcon={<SvgXml xml={PersonIcon()} width={20} height={20} />}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <ActivityIndicator size="large" color="#9A0B26" />
          <Text color="black" fontStyle="p-16-regular" style={{ marginTop: 16 }}>
            Carregando dados...
          </Text>
        </View>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      titleText={'Minha Conta'}
      titleIcon={<SvgXml xml={PersonIcon()} width={20} height={20} />}
    >
      {renderEditForm()}
    </PageScaffold>
  );
};

export default MyAccount; 
