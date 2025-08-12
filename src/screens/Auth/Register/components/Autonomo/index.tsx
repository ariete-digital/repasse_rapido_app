import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import { Text, TextInput } from '@components/index';
import ImagePickerExample from '../FilePicker';
import { api } from '@lib/api';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { SubmitForm } from '../shared/SubmitForm';
import * as I from './styles';
import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { theme } from '@theme/GlobalStyles';

const signUpSchema = yup.object({
  nome: yup.string().required('Informe o nome completo!'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido.'),
  cpf: yup.string().required('Informe o CPF!'),
  telefone: yup.string().required('Informe o telefone!'),
  cep: yup.string().required('Informe o CEP!'),
  endereço: yup.string().required('Informe o endereço!'),
  numero: yup.string().required('Informe o número!'),
  complemento: yup.string(),
  bairro: yup.string().required('Informe o bairro!'),
  cidade: yup.string().required('Informe a cidade!'),
  senha: yup.string().required('Informe a senha!'),
  confirmarSenha: yup
    .string()
    .required('Informe a confirmação de senha!')
    // @ts-ignore
    .oneOf([yup.ref('senha'), null], 'A confirmação da senha não confere!'),
});

interface AutonomoFormProps {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereço: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  senha: string;
  confirmarSenha: string;
}

const Autonomo = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AutonomoFormProps>({
    resolver: yupResolver(signUpSchema),
  });

  const handleRegister = (data: AutonomoFormProps) => {

    const { 
      nome, 
      email,
      cpf,
      telefone,
      cep,
      endereço,
      numero,
      complemento,
      bairro,
      cidade, 
      senha
    } = data;
    
    const userData = {
      nome,
      email,
      senha,
      cpf,
      telefone,
      cep,
      endereço,
      numero,
      complemento,
      bairro,
      cidade,
      tipo: 'autonomo',
    };

    setIsLoading(true);

    api
      .post('/cadastrar', userData)
      .then(async (res) => {
        if (res.status >= 200 && res.status <= 400) {
          toast.show('Usuário cadastrado com sucesso!', { type: 'success' });
          navigation.navigate('registerSuccess');
          return;
        } else {
          toast.show(
            'Oops! Usuário já cadastrado, \n verifique seus dados ou faça login!',
            { type: 'danger' }
          );
          return;
        }
      })
      .catch(() => {
        toast.show(
          'Bip Bop! Um erro ocorreu, \n tente novamente mais tarde...',
          { type: 'danger' }
        );
      })
      .finally(() => setIsLoading(false));
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
        name="cpf"
        render={({ field: { onChange } }) => (
          <TextInput
            label="CPF"
            keyboardType="numeric"
            onChangeText={onChange}
            errorMessage={errors.cpf?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Telefone"
            keyboardType="phone-pad"
            onChangeText={onChange}
            errorMessage={errors.telefone?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="cep"
        render={({ field: { onChange } }) => (
          <TextInput
            label="CEP"
            keyboardType="numeric"
            onChangeText={onChange}
            errorMessage={errors.cep?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="endereço"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Endereço"
            onChangeText={onChange}
            errorMessage={errors.endereço?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="numero"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Número"
            keyboardType="numeric"
            onChangeText={onChange}
            errorMessage={errors.numero?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="complemento"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Complemento"
            onChangeText={onChange}
            errorMessage={errors.complemento?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="bairro"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Bairro"
            onChangeText={onChange}
            errorMessage={errors.bairro?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="cidade"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Cidade"
            onChangeText={onChange}
            errorMessage={errors.cidade?.message}
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


      <I.DocumentsContainer>
        <Text color="black" fontStyle="p-16-bold">
          Documentos
        </Text>
        <Text color="black" spacingY={8}>
          Envie seus documentos conforme solicitação abaixo.
        </Text>
        <Text color="black" fontStyle="p-14-bold" spacingY={12}>
          Envie sua CNH abaixo.
        </Text>
        <ImagePickerExample />
        <Text color="black" spacingY={12} style={{marginTop: 30}}>
          <Text color="black-700" fontStyle="p-14-bold">
            Envie uma foto de um comprovante de endereço recente.
          </Text>{' '}
          O comprovante deverá ser recente (últimos 3 meses) em seu nome, podendo também estar no nome dos seus pais ou cônjuge, neste caso sendo necessário o envio de certidão de casamento também.
        </Text>
        <ImagePickerExample />
        <Text color="black" spacingY={12} style={{marginTop: 30}}>
          <Text color="black-700" fontStyle="p-14-bold">
            Declaração autenticada em cartório
          </Text>{' '}
          afirmando que o cadastro trata-se de Vendedor de Veículos AUTÔNOMO.
        </Text>
        <ImagePickerExample />
        <View>
          <Text color="black-700" fontStyle="p-14-bold" spacingY={32}>
            Ao se cadastrar como vendedor (loja ou repassador), você autoriza que seus dados sejam armazenados no banco de dados do aplicativo e compreende que, após cada venda, o comprador será convidado a avaliar seu atendimento e confiabilidade. Essas avaliações influenciam diretamente sua reputação dentro da plataforma. Em caso de inconformidades nas negociações ou reclamações recorrentes, seus anúncios poderão ser bloqueados temporariamente ou removidos, a critério da moderação. Mantenha sempre uma conduta profissional e transparente para garantir boas avaliações e maior visibilidade.
          </Text>
        </View>
      </I.DocumentsContainer>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginHorizontal: 22
        }}
      >
        <BouncyCheckbox
          onPress={() => setToggleCheckBox((prev) => !prev)}
          isChecked={toggleCheckBox}
          innerIconStyle={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: toggleCheckBox ? "#9A0B26" : "#EBE8D9",
            backgroundColor: toggleCheckBox ? "#9A0B26" : "#F9F7F7",
          }}
          iconStyle={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: toggleCheckBox ? "#9A0B26" : "#EBE8D9",
            backgroundColor: toggleCheckBox ? "#9A0B26" : "#F9F7F7",
          }}
          textStyle={{
            color: theme.colors['brand-blue'],
          }}
        />

        <Text color="black-700" fontStyle='c-12-bold' align="left">Declaro que as informações acima são verdadeiras. Li e concordo com os termos acima. </Text>
      </View>

      <SubmitForm
        handleRegister={handleSubmit(handleRegister)}
        disabled={isLoading}
      />
      <View>
        <Text color="black-700" fontStyle="p-14-bold" spacingY={32}>
          A sua privacidade e a proteção dos seus dados pessoais são importantes para o Repasse Rápido, portanto de de acordo com a LGPD afirmamos que o Repasse Rápido adota todas as medidas necessárias para observância da confidencialidade dos seus dados.
        </Text>
      </View>
      <I.Spacer />
    </I.Container>
  );
};

export default Autonomo;
