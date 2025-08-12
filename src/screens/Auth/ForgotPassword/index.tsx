import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

import { HeaderLogo, Text, TextInput } from '@components/index';
import BasicButton from '@components/BasicButton';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import * as S from './styles';
import { MaterialIcons } from '@expo/vector-icons';

type ForgotPasswordForm = {
  email: string;
};

const ForgotPassword = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = () => {
    navigation.navigate('forgotPasswordSuccess');
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
          <MaterialIcons name="chevron-left" size={38} color={'#272A30'} />
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
          />
        </View>
      </S.Form>
    </S.Container>
  );
};

export default ForgotPassword;

