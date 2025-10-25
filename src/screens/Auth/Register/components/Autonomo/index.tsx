import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import { Text, TextInput } from '@components/index';
import Select from '@components/Select';
import ImagePickerExample from '../FilePicker';
import { api } from '@lib/api';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { SubmitForm } from '../shared/SubmitForm';
import * as I from './styles';
import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { theme } from '@theme/GlobalStyles';
import { maskCPF, maskCNPJ, maskPhone, maskCEP, unmask } from '@utils/masks';
import axios from 'axios';

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
  id_cidade: yup.number().required('Informe a cidade!'),
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
  id_cidade: number;
  senha: string;
  confirmarSenha: string;
}

const Autonomo = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)
  const [citiesOptions, setCitiesOptions] = useState<Array<{label: string, value: string}>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AutonomoFormProps>({
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
        // Converter value de number para string
        const cities = response.data.content.map((city: any) => ({
          label: city.label,
          value: city.value.toString()
        }));
        setCitiesOptions(cities);
      }
    } catch (error) {
      console.warn('Erro ao carregar cidades:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = unmask(cep);
    
    if (cleanCep.length !== 8) return;

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
      console.log('ViaCEP response:', response.data);

      if (response.data && !response.data.erro) {
        const { logradouro, bairro, localidade } = response.data;
        
        console.log('Setting endereço:', logradouro);
        console.log('Setting bairro:', bairro);
        
        setValue('endereço', logradouro);
        setValue('bairro', bairro);
        
        // Buscar id_cidade
        try {
          const cityData = await api.get(`/cliente/listagem/todas_cidades?filtro=${localidade}`);
          console.log('City search result:', cityData.data);
          
          if (cityData.data?.content?.[0]) {
            const cityId = cityData.data.content[0].value;
            console.log('Setting id_cidade:', cityId);
            setValue('id_cidade', cityId);
            // Atualizar a lista de cidades para incluir a cidade encontrada
            const cityOption = {
              label: cityData.data.content[0].label,
              value: cityId.toString()
            };
            if (!citiesOptions.find(c => c.value === cityId.toString())) {
              setCitiesOptions([...citiesOptions, cityOption]);
            }
          }
        } catch (error) {
          console.warn('Erro ao buscar cidade:', error);
        }
        
        toast.show('Endereço encontrado!', { type: 'success' });
      } else {
        toast.show('CEP não encontrado', { type: 'warning' });
      }
    } catch (error) {
      console.warn('Erro ao buscar CEP:', error);
      toast.show('Erro ao buscar CEP', { type: 'danger' });
    }
  };

  const handleRegister = async (data: AutonomoFormProps) => {
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
      id_cidade, 
      senha
    } = data;
    
    const userData = {
      nome,
      email,
      senha,
      num_documento: cpf,
      telefone,
      cep,
      logradouro: endereço,
      numero,
      complemento,
      bairro,
      id_cidade,
      tipo: 'A', // Anônimo type as per API documentation
    };

    setIsLoading(true);

    try {
      console.log("RegisterAutonomo userData", userData);
      const response = await api.post('/cadastrar', userData);
      console.log("RegisterAutonomo response", response);
      console.log("RegisterAutonomo response.data", response.data);
      
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
        name="cpf"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="CPF"
            value={maskCPF(value || '')}
            keyboardType="numeric"
            onChangeText={(text) => onChange(text)}
            errorMessage={errors.cpf?.message}
            maxLength={14}
          />
        )}
      />
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Telefone"
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
        name="endereço"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Endereço"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.endereço?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="numero"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Número"
            value={value}
            keyboardType="numeric"
            onChangeText={onChange}
            errorMessage={errors.numero?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="complemento"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Complemento"
            value={value}
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
