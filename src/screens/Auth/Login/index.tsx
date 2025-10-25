import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import {
  GradientButton,
  HeaderLogo,
  Text,
  TextContainer,
  TextInput,
} from '@components/index';

import { useAuth } from '@hooks/useAuth';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { openUrl } from '@utils/index';
import { useState } from 'react';
import { useToast } from 'react-native-toast-notifications';
import ForgotPasswordButton from './components/ForgotPassword';
import * as L from './styles';
import { ChevronLeftIcon } from '@components/CustomIcons';
import BasicButton from '@components/BasicButton';

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { signIn } = useAuth();
  const toast = useToast();

  const handleLogin = async ({ email, password }: ILoginForm) => {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch {
      toast.show('Confira os seus dados e tente novamente!', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  return (
    <L.Container>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#EBE8D9"
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ChevronLeftIcon size={38} color={"#272A30"} />
          <Text fontStyle="p-18-regular" color="black-400" style={{ fontFamily: 'Cabin'}}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
      <L.Header>
        <HeaderLogo />
      </L.Header>
      <L.Form>
        <TextContainer width="100">
          <Text fontStyle="t-24" color="black-700">
            Olá
          </Text>
          <Text fontStyle="p-14-medium" color="black-700">
            Insira seu e-mail e senha para fazer login.
          </Text>
        </TextContainer>
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

        <View style={{ width: '100%', gap: 10 }}>
          <Controller
            control={control}
            name="password"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <TextInput
                label="Senha"
                placeholder="senha"
                name="password"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                secureTextEntry={!showPassword}
                showPasswordButton
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
              />
            )}
          />
          <ForgotPasswordButton />
        </View>

        <View
          style={{
            alignItems: "center",
            flex: 1,
            width: "100%",
            paddingLeft: 30,
            paddingRight: 30,
            marginTop: 24
          }}
        >
          <BasicButton
            label="Entrar"
            onPress={handleSubmit(handleLogin)}
            backgroundColor='#9A0B26'
            color='white'
            disabled={isLoading}
          />
        </View>
        <View style={{ marginVertical: 10, gap: 16 }}>

          <TextContainer direction="row" justify="center">
            <Text color="black" >Não é cadastrado?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('register')}>
              <Text color="brand-blue" decoration="underline">
                {' '}
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </TextContainer>
        </View>
      </L.Form>

      <View>
        <Text color="black-700">Para mais informações, verifique nossos</Text>
        <TouchableOpacity
          onPress={() =>
            openUrl('https://repasserapido.com.br/en/politica-de-privacidade')
          }
        >
          <Text color="black-700" decoration="underline">
            Termos de Uso e Política de Privacidade.
          </Text>
        </TouchableOpacity>
      </View>
    </L.Container>
  );
};

export default Login;
