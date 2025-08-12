import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import { Text, TextInput } from '@components/index';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@lib/api';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { RequestProps } from '../Autocomplete';
import ImagePickerExample from '../FilePicker';
import { SubmitForm } from '../shared/SubmitForm';
import * as L from './styles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { theme } from '@theme/GlobalStyles';

interface LegalFormProps {
  nome: string;
  nome_fantasia: string;
  num_documento: string;
  email: string;
  senha: string;
  confirmacao: string;
  celular: string;
  telefone: string;
  cep: string;
  logradouro: string;
  bairro: string;
  numero: string;
  complemento: string;
  nome_responsavel: string;
  cpf_responsavel: string;
  id_cidade: number;
  inscricao_estadual: string;
  rg: string;
  // comprovEnd?: File
  // cnh?: File
  // docComplementar?: File
}

const signUpSchema = yup.object({
  nome: yup.string().required('Informe o nome completo!'),
  num_documento: yup.string().required('Informe o número do documento'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido.'),
  senha: yup.string().required('Informe a senha!'),
  confirmacao: yup
    .string()
    .required('Informe a confirmação de senha!')
    // @ts-ignore
    .oneOf([yup.ref('senha'), null], 'A confirmação da senha não confere!'),
  nome_fantasia: yup.string().required('Informe o nome fantasia!'),
  celular: yup.string().required('Informe o celular!'),
  telefone: yup.string().required('Informe o telefone fixo!'),
  cep: yup.string().required('Informe o CEP!'),
  logradouro: yup.string().required('Informe o logradouro!'),
  bairro: yup.string().required('Informe o bairro!'),
  numero: yup.string().required('Informe o número!'),
  complemento: yup.string().required('Informe o complemento!'),
  nome_responsavel: yup.string().required('Informe o nome do responsável!'),
  cpf_responsavel: yup.string().required('Informe o CPF do responsável'),
  id_cidade: yup.number().required('Informe a cidade!'),
  inscricao_estadual: yup
    .string()
    .required('Informe o nome a inscrição estadual!'),
  rg: yup.string().required('Informe o número do RG!'),
});

const Legal = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cityLabel, setCityLabel] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)
  const [toggleCheckBox1, setToggleCheckBox1] = useState<boolean>(false)
  const [toggleCheckBox2, setToggleCheckBox2] = useState<boolean>(false)


  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LegalFormProps>({
    resolver: yupResolver(signUpSchema),
  });

  const handleRegister = (data: LegalFormProps) => {
    const legalPersonData = {
      tipo: 'PJ',
      ...data,
    };

    api
      .post('/cadastrar', legalPersonData)
      .then(async (res) => {
        toast.show('Usuário cadastrado com sucesso!', { type: 'success' });
        navigation.navigate('registerSuccess');
      })
      .catch(() =>
        toast.show(
          'Bip Bop! Um erro ocorreu, \n tente novamente mais tarde...',
          { type: 'danger' }
        )
      )
      .finally(() => setIsLoading(false));
  };

  const fetchAddressByCEP = async (cep: string) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (response.data) {
        const { bairro, logradouro, localidade } = response.data;
        setValue('bairro', bairro);
        setValue('logradouro', logradouro);
        const cityData = await api.get<RequestProps>(
          `/cliente/listagem/cidades?filtro=${localidade}`
        );
        setValue('id_cidade', cityData.data.content[0].value);
        setCityLabel(cityData.data.content[0].label);
      }
    } catch (error) {
      console.warn(error);
      toast.show('Erro ao obter dados do CEP!', { type: 'danger' });
      // Handle error
    }
  };

  return (
    <L.Container>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Razão Social"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.nome?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="nome_fantasia"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Nome Fantasia"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.nome_fantasia?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="num_documento"
        render={({ field: { onChange } }) => (
          <TextInput
            label="CNPJ"
            keyboardType="number-pad"
            onChangeText={onChange}
            errorMessage={errors.num_documento?.message}
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
            onChangeText={onChange}
            errorMessage={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="celular"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Celular"
            keyboardType="phone-pad"
            onChangeText={onChange}
            errorMessage={errors.celular?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Telefone Fixo"
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
            autoCapitalize="none"
            onChangeText={(value) => {
              onChange(value);
              if (value.length === 8) {
                fetchAddressByCEP(value);
              }
            }}
            errorMessage={errors.cep?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="logradouro"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Endereço"
            value={value}
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.logradouro?.message}
            editable={false}
          />
        )}
      />
      
      <Controller
        control={control}
        name="numero"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Número"
            keyboardType="number-pad"
            autoCapitalize="none"
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
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.complemento?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="bairro"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Bairro"
            value={value}
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.bairro?.message}
            editable={false}
          />
        )}
      />
      <TextInput
        label="Cidade"
        value={cityLabel}
        autoCapitalize="none"
        errorMessage={errors.nome_responsavel?.message}
        editable={false}
      />
      <Controller
        control={control}
        name="inscricao_estadual"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Inscrição Estadual"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.inscricao_estadual?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="nome_responsavel"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Nome do Responsável"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.nome_responsavel?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="cpf_responsavel"
        render={({ field: { onChange } }) => (
          <TextInput
            label="CPF do Responsável"
            keyboardType="number-pad"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.cpf_responsavel?.message}
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
        name="confirmacao"
        render={({ field: { onChange } }) => (
          <TextInput
            label="Confirmar Senha"
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.confirmacao?.message}
            secureTextEntry={!showPassword}
            showPasswordButton
            onShowPasswordToggle={() => setShowPassword(!showPassword)}
          />
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingRight: 22,
          marginTop: 32
        }}
      >
        <BouncyCheckbox
          onPress={() => setToggleCheckBox1((prev) => !prev)}
          isChecked={toggleCheckBox1}
          innerIconStyle={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: toggleCheckBox1 ? "#9A0B26" : "#EBE8D9",
            backgroundColor: toggleCheckBox1 ? "#9A0B26" : "#F9F7F7",
          }}
          iconStyle={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: toggleCheckBox1 ? "#9A0B26" : "#EBE8D9",
            backgroundColor: toggleCheckBox1 ? "#9A0B26" : "#F9F7F7",
          }}
          textStyle={{
            color: theme.colors['brand-blue'],
          }}
        />

        <Text color="black-700" fontStyle='c-12-regular' align="left">
          <Text color="black-700" fontStyle='c-12-bold' align="left">QUERO</Text>
          {" "}receber pedidos de particulares para anunciar veículos.
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingRight: 22,
          marginTop: 20
        }}
      >
        <BouncyCheckbox
          onPress={() => setToggleCheckBox2((prev) => !prev)}
          isChecked={toggleCheckBox2}
          innerIconStyle={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: toggleCheckBox2 ? "#9A0B26" : "#EBE8D9",
            backgroundColor: toggleCheckBox2 ? "#9A0B26" : "#F9F7F7",
          }}
          iconStyle={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: toggleCheckBox2 ? "#9A0B26" : "#EBE8D9",
            backgroundColor: toggleCheckBox2 ? "#9A0B26" : "#F9F7F7",
          }}
          textStyle={{
            color: theme.colors['brand-blue'],
          }}
        />

        <Text color="black-700" fontStyle='c-12-regular' align="left">
          <Text color="black-700" fontStyle='c-12-bold' align="left">NÃO QUERO</Text>
          {" "}receber pedidos de particulares para anunciar veículos.
        </Text>
      </View>
      <L.DocumentsContainer>
        <Text color="black" fontStyle="p-16-bold">
          Documentos
        </Text>
        <Text color="black" spacingY={8}>
          Envie seus documentos conforme solicitação abaixo.
        </Text>
        <Text color="black" fontStyle="p-14-bold" spacingY={12}>
          Envie o cartão CNPJ com o CNAE 4511
        </Text>
        <ImagePickerExample />
        <Text color="black" fontStyle="p-14-bold" spacingY={12} style={{marginTop: 32}}>
          Envie a CNH do responsável legal para empresa.
        </Text>
        <ImagePickerExample />
        <View>
          <Text color="black-700" fontStyle="p-14-bold" spacingY={32}>
            Ao se cadastrar como vendedor (loja ou repassador), você autoriza que seus dados sejam armazenados no banco de dados do aplicativo e compreende que, após cada venda, o comprador será convidado a avaliar seu atendimento e confiabilidade. Essas avaliações influenciam diretamente sua reputação dentro da plataforma. Em caso de inconformidades nas negociações ou reclamações recorrentes, seus anúncios poderão ser bloqueados temporariamente ou removidos, a critério da moderação. Mantenha sempre uma conduta profissional e transparente para garantir boas avaliações e maior visibilidade.
          </Text>
        </View>
      </L.DocumentsContainer>

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
      <L.Spacer />
    </L.Container>
  );
};

export default Legal;
