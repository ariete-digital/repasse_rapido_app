import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { useToast } from 'react-native-toast-notifications';

import { HeaderLogo, Text, TextInput } from '@components/index';
import BasicButton from '@components/BasicButton';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { api } from '@lib/api';
import * as S from './styles';
import { ChevronLeftIcon } from '@components/CustomIcons';

type ForgotPasswordForm = {
  email: string;
};

const ForgotPassword = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const response = await api.post('/recuperar_senha', {
        email: data.email,
        url: 'exp://repasse-rapido.com/forgot-password' // Deep link para o app
      });

      if (response.data) {
        toast.show('E-mail de recuperação enviado com sucesso!', { type: 'success' });
        navigation.navigate('forgotPasswordSuccess');
      }
    } catch (error: any) {
      
      const errorMessage = error.response?.data?.message || 
                          'Erro ao enviar e-mail de recuperação. Verifique o e-mail e tente novamente!';
      
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
            Informe seu e-mail para enviarmos o link de recuperação.
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          rules={{ required: 'Informe o e-mail' }}
          render={({ field: { onChange } }) => (
            <TextInput
              label="E-mail"
              placeholder="email@email.com.br"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              errorMessage={errors.email?.message}
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
            label="Enviar"
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

export default ForgotPassword;

