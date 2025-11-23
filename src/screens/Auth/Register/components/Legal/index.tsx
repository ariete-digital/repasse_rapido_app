import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import { Text, TextInput } from '@components/index';
import Select from '@components/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@lib/api';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { RequestProps } from '../Autocomplete';
import ImagePickerExample from '../FilePicker';
import { SubmitForm } from '../shared/SubmitForm';
import * as L from './styles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { theme } from '@theme/GlobalStyles';
import { maskCNPJ, maskCPF, maskPhone, maskCEP, unmask } from '@utils/masks';

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
  complemento?: string; 
  nome_responsavel: string;
  cpf_responsavel: string;
  id_cidade: number;
  inscricao_estadual: string;
  rg?: string; 

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
  complemento: yup.string().optional(), 
  nome_responsavel: yup.string().required('Informe o nome do responsável!'),
  cpf_responsavel: yup.string().required('Informe o CPF do responsável'),
  id_cidade: yup.number().required('Informe a cidade!'),
  inscricao_estadual: yup
    .string()
    .required('Informe o nome a inscrição estadual!'),
  rg: yup.string().optional(), 
});

const Legal = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [citiesOptions, setCitiesOptions] = useState<Array<{label: string, value: string}>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)
  const [toggleCheckBox1, setToggleCheckBox1] = useState<boolean>(false)
  const [toggleCheckBox2, setToggleCheckBox2] = useState<boolean>(false)
  const [cnhImage, setCnhImage] = useState<string | null>(null);
  const [cnhFileName, setCnhFileName] = useState<string | null>(null);
  const [cnhMimeType, setCnhMimeType] = useState<string>('image/jpeg');
  const [complementarImage, setComplementarImage] = useState<string | null>(null);
  const [complementarFileName, setComplementarFileName] = useState<string | null>(null);
  const [complementarMimeType, setComplementarMimeType] = useState<string>('image/jpeg');

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

  useEffect(() => {
    loadCities('');
  }, []);

  const loadCities = async (filtro: string = '') => {
    try {
      setLoadingCities(true);
      const response = await api.get(`/cliente/listagem/todas_cidades?filtro=${filtro}`);
      if (response.data?.content) {
        
        const cities = response.data.content.map((city: any) => ({
          label: city.label,
          value: city.value.toString()
        }));
        setCitiesOptions(cities);
      }
    } catch (error) {
    } finally {
      setLoadingCities(false);
    }
  };

  const handleRegister = async (data: LegalFormProps) => {
    
    const formData = new FormData();

    formData.append('nome', data.nome);
    formData.append('email', data.email);
    formData.append('senha', data.senha);
    formData.append('tipo', 'PJ');
    formData.append('num_documento', data.num_documento.replace(/\D/g, '')); 
    formData.append('telefone', data.telefone.replace(/\D/g, '')); 
    formData.append('cep', data.cep.replace(/\D/g, '')); 
    formData.append('logradouro', data.logradouro);
    formData.append('numero', data.numero);
    if (data.complemento) {
      formData.append('complemento', data.complemento);
    }
    formData.append('bairro', data.bairro);
    formData.append('id_cidade', data.id_cidade.toString());
    formData.append('nome_fantasia', data.nome_fantasia);
    formData.append('celular', data.celular.replace(/\D/g, '')); 
    formData.append('nome_responsavel', data.nome_responsavel);
    formData.append('cpf_responsavel', data.cpf_responsavel.replace(/\D/g, '')); 
    formData.append('inscricao_estadual', data.inscricao_estadual);

    if (cnhImage) {
      formData.append('cnh', {
        uri: cnhImage,
        type: cnhMimeType,
        name: cnhFileName || 'cnh',
      } as any);
    }

    if (complementarImage) {
      formData.append('complementar', {
        uri: complementarImage,
        type: complementarMimeType,
        name: complementarFileName || 'complementar',
      } as any);
    }

    setIsLoading(true);

    try {
      
      const response = await api.post('/cadastrar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        toast.show('Usuário cadastrado com sucesso!', { type: 'success' });
        navigation.navigate('registerSuccess');
      }
    } catch (error: any) {
      
      const errorMessage = error.response?.data?.message || 
                          'Erro ao cadastrar usuário. Verifique os dados e tente novamente!';
      
      toast.show(errorMessage, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitWithValidation = (data: LegalFormProps) => {
    handleRegister(data);
  };

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = unmask(cep);
    
    if (cleanCep.length !== 8) return;

    try {
      const response = await axios.get(`https:

      if (response.data && !response.data.erro) {
        const { bairro, logradouro, localidade } = response.data;
        setValue('bairro', bairro);
        setValue('logradouro', logradouro);
        
        try {
          const cityData = await api.get<RequestProps>(
            `/cliente/listagem/todas_cidades?filtro=${localidade}`
          );
          if (cityData.data?.content?.[0]) {
            const cityId = cityData.data.content[0].value;
            setValue('id_cidade', cityId);
            
            const cityOption = {
              label: cityData.data.content[0].label,
              value: cityId.toString()
            };
            if (!citiesOptions.find(c => c.value === cityId.toString())) {
              setCitiesOptions([...citiesOptions, cityOption]);
            }
          }
        } catch (error) {
        }
        
        toast.show('Endereço encontrado!', { type: 'success' });
      } else {
        toast.show('CEP não encontrado', { type: 'warning' });
      }
    } catch (error) {
      toast.show('Erro ao buscar CEP', { type: 'danger' });
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="CNPJ"
            value={maskCNPJ(value || '')}
            keyboardType="number-pad"
            onChangeText={(text) => onChange(text)}
            errorMessage={errors.num_documento?.message}
            maxLength={18}
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Celular"
            value={maskPhone(value || '')}
            keyboardType="phone-pad"
            onChangeText={(text) => onChange(text)}
            errorMessage={errors.celular?.message}
            maxLength={15}
          />
        )}
      />
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Telefone Fixo"
            value={maskPhone(value || '')}
            keyboardType="phone-pad"
            onChangeText={(text) => onChange(text)}
            errorMessage={errors.telefone?.message}
            maxLength={15}
          />
        )}
      />

      <Controller
        control={control}
        name="cep"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="CEP"
            value={maskCEP(value || '')}
            keyboardType="numeric"
            onChangeText={(text) => {
              onChange(text);
              if (unmask(text).length === 8) {
                fetchAddressByCEP(text);
              }
            }}
            errorMessage={errors.cep?.message}
            maxLength={9}
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
          />
        )}
      />
      <Controller
        control={control}
        name="id_cidade"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Cidade"
            options={citiesOptions}
            selectedValue={value?.toString()}
            onSelect={(selectedValue) => onChange(Number(selectedValue))}
            placeholder="Selecione uma cidade"
            error={errors.id_cidade?.message}
            disabled={loadingCities}
            enableSearch={true}
            searchPlaceholder="Buscar cidade..."
            labelFontStyle="p-14-regular"
            placeholderFontStyle="p-14-regular"
          />
        )}
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="CPF do Responsável"
            value={maskCPF(value || '')}
            keyboardType="number-pad"
            autoCapitalize="none"
            onChangeText={(text) => onChange(text)}
            errorMessage={errors.cpf_responsavel?.message}
            maxLength={14}
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
          paddingRight: 36,
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
          paddingRight: 30,
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
        <ImagePickerExample 
          onImageSelected={(uri, fileName, mimeType) => {
            setComplementarImage(uri);
            setComplementarFileName(fileName || null);
            setComplementarMimeType(mimeType || 'image/jpeg');
          }}
          label="Selecionar"
        />
        <Text color="black" fontStyle="p-14-bold" spacingY={12} style={{marginTop: 32}}>
          Envie a CNH do responsável legal para empresa.
        </Text>
        <ImagePickerExample 
          onImageSelected={(uri, fileName, mimeType) => {
            setCnhImage(uri);
            setCnhFileName(fileName || null);
            setCnhMimeType(mimeType || 'image/jpeg');
          }}
          label="Selecionar"
        />
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
        handleRegister={handleSubmit(handleSubmitWithValidation, (errors) => {
          toast.show('Preencha todos os campos obrigatórios', { type: 'danger' });
        })}
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
