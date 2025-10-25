import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { HeaderLogo, Text, TextInput } from '@components/index';
import BasicButton from '@components/BasicButton';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { api } from '@lib/api';
import * as S from './styles';
import { ChevronLeftIcon } from '@components/CustomIcons';

type CreateNewPasswordForm = {
  senha: string;
  confirmarSenha: string;
};

type RouteParams = {
  token: string;
};

const createNewPasswordSchema = yup.object({
  senha: yup.string().required('Informe a nova senha!').min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: yup
    .string()
    .required('Confirme a nova senha!')
    .oneOf([yup.ref('senha'), null], 'As senhas não coincidem!'),
});

const CreateNewPassword = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toast = useToast();

  const { token } = (route.params as RouteParams) || {};

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewPasswordForm>({
    resolver: yupResolver(createNewPasswordSchema),
  });

  const onSubmit = async (data: CreateNewPasswordForm) => {
    if (!token) {
      toast.show('Token inválido. Solicite uma nova recuperação de senha.', { type: 'danger' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/cadastrar_nova_senha', {
        token,
        senha: data.senha
      });

      if (response.data) {
        toast.show('Senha alterada com sucesso!', { type: 'success' });
        navigation.navigate('login');
      }
    } catch (error: any) {
      console.error('Create new password error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Erro ao alterar senha. Verifique o token e tente novamente!';
      
      toast.show(errorMessage, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#EBE8D9',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ChevronLeftIcon size={38} color={'#272A30'} />
          <Text fontStyle="p-18-regular" color="black-400" style={{ fontFamily: 'Cabin' }}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      <S.Header>
        <HeaderLogo />
      </S.Header>

      <S.Form>
        <View style={{ width: '100%', gap: 6 }}>
          <Text fontStyle="p-14-medium" color="black-700">
            Digite sua nova senha abaixo.
          </Text>
        </View>

        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange } }) => (
            <TextInput
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              autoCapitalize="none"
              onChangeText={onChange}
              errorMessage={errors.senha?.message}
              secureTextEntry={!showPassword}
              showPasswordButton
              onShowPasswordToggle={() => setShowPassword(!showPassword)}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmarSenha"
          render={({ field: { onChange } }) => (
            <TextInput
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              autoCapitalize="none"
              onChangeText={onChange}
              errorMessage={errors.confirmarSenha?.message}
              secureTextEntry={!showPassword}
              showPasswordButton
              onShowPasswordToggle={() => setShowPassword(!showPassword)}
            />
          )}
        />

        <View
          style={{
            alignItems: 'center',
            width: '100%',
            paddingLeft: 30,
            paddingRight: 30,
            marginTop: 24,
          }}
        >
          <BasicButton
            label="Alterar Senha"
            onPress={handleSubmit(onSubmit)}
            backgroundColor="#9A0B26"
            color="white"
            disabled={isLoading}
          />
        </View>
      </S.Form>
    </S.Container>
  );
};

export default CreateNewPassword;
