import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

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
import BasicButton from '@components/BasicButton';

const DELETE_ACCOUNT_ENDPOINT = '/cliente/minha_conta/excluir';

const MyAccount = () => {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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

  const deleteMyAccount = async () => {
    try {
      setIsDeletingAccount(true);

      const response = await api.post(DELETE_ACCOUNT_ENDPOINT);

      const message =
        response?.data?.content?.message ||
        response?.data?.message ||
        'Conta excluída com sucesso!';

      toast.show(message, { type: 'success' });

      await signOut({ silent: true });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Não foi possível excluir sua conta. Tente novamente.';
      toast.show(message, { type: 'danger' });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const confirmDeleteMyAccount = () => {
    if (isDeletingAccount) return;

    Alert.alert(
      'Excluir conta',
      'Essa ação é irreversível. Sua conta e todos os dados vinculados serão excluídos.\n\nDeseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: deleteMyAccount,
        },
      ]
    );
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

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 40,
          gap: 12,
        }}
      >
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#F1F4F9',
            paddingTop: 20,
            gap: 10,
          }}
        >
          <Text fontStyle="p-18-bold" color="red">
            Zona de perigo
          </Text>
          <Text fontStyle="p-14-regular" color="black-300">
            Exclui sua conta e todos os dados vinculados. Essa ação não pode ser desfeita.
          </Text>

          <BasicButton
            label={isDeletingAccount ? 'Excluindo...' : 'Excluir minha conta'}
            onPress={confirmDeleteMyAccount}
            disabled={isDeletingAccount}
            backgroundColor="#E11138"
            color="white"
          />
        </View>
      </View>
    </PageScaffold>
  );
};

export default MyAccount; 
