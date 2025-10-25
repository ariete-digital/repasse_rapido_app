import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import TextInput from '@components/TextInput';
import { api } from '@lib/api';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { SubmitForm } from '../shared/SubmitForm';
import * as I from './styles';

const signUpSchema = yup.object({
  nome: yup.string().required('Informe o nome completo!'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido.'),
  senha: yup.string().required('Informe a senha!'),
  confirmarSenha: yup
    .string()
    .required('Informe a confirmação de senha!')
    // @ts-ignore
    .oneOf([yup.ref('senha'), null], 'A confirmação da senha não confere!'),
});

interface IndividualFormProps {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const Individual = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IndividualFormProps>({
    resolver: yupResolver(signUpSchema),
  });

  const handleRegister = async (data: IndividualFormProps) => {
    const { nome, email, senha } = data;
    const userData = {
      nome,
      email,
      senha,
      tipo: 'PF',
    };

    setIsLoading(true);

    try {
      console.log("RegisteIndividual userData", userData);
      const response = await api.post('/cadastrar', userData);
      console.log("RegisterIndividual response", response);
      console.log("RegisterIndividual response.data", response.data);
      if (response.data) {
        toast.show('Usuário cadastrado com sucesso!', { type: 'success' });
        navigation.navigate('registerSuccess');
      }
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Erro ao cadastrar usuário. Verifique os dados e tente novamente!';
      
      toast.show(errorMessage, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <I.Container>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Nome Completo"
            onChangeText={onChange}
            errorMessage={errors.nome?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange } }) => (
          <TextInput
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Senha"
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
            label="Confirmar Senha"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.confirmarSenha?.message}
            secureTextEntry={!showPassword}
            showPasswordButton
            onShowPasswordToggle={() => setShowPassword(!showPassword)}
          />
        )}
      />
      <SubmitForm
        handleRegister={handleSubmit(handleRegister)}
        disabled={isLoading}
      />
      <I.Spacer />
    </I.Container>
  );
};

export default Individual;
