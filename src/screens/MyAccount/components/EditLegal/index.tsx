import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import TextInput from '@components/TextInput';
import Text from '@components/Text';
import Select from '@components/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import ImagePickerExample from '../FilePicker';
import * as L from './styles';
import axios from 'axios';
import { api } from '@lib/api';
import { RequestProps } from '@screens/Auth/Register/components/Autocomplete';
import { View } from 'react-native';
import BasicButton from '@components/BasicButton';
import { UserDTO } from '@lib/storage/storageUser';
import { useAuth } from '@hooks/useAuth';
import { maskCNPJ, maskCPF, maskPhone, maskCEP, unmask } from '@utils/masks';

const editSchema = yup.object({
  nome: yup.string().required('Informe o nome completo!'),
  num_documento: yup.string().required('Informe o número do documento'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido.'),
  senhaAtual: yup.string().optional(),
  senha: yup.string().optional(),
  confirmacao: yup.string().optional(),
  nome_fantasia: yup.string(),
  celular: yup.string().required('Informe o celular!'),
  telefone: yup.string().required('Informe o telefone fixo!'),
  cep: yup.string().required('Informe o CEP!'),
  logradouro: yup.string().required('Informe o logradouro!'),
  bairro: yup.string().required('Informe o bairro!'),
  numero: yup.string().required('Informe o número!'),
  complemento: yup.string(),
  nome_responsavel: yup.string(),
  cpf_responsavel: yup.string(),
  id_cidade: yup.number(),
  inscricao_estadual: yup.string(),
  rg: yup.string(),
});

interface EditLegalFormProps {
  nome: string;
  nome_fantasia?: string;
  num_documento: string;
  email: string;
  senhaAtual?: string;
  senha?: string;
  confirmacao?: string;
  celular: string;
  telefone: string;
  cep: string;
  logradouro: string;
  bairro: string;
  numero: string;
  complemento?: string;
  nome_responsavel?: string;
  cpf_responsavel?: string;
  id_cidade?: number;
  inscricao_estadual?: string;
  rg?: string;
}

interface EditLegalProps {
  userData: UserDTO;
  onUpdate: () => void;
}

const EditLegal = ({ userData, onUpdate }: EditLegalProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [citiesOptions, setCitiesOptions] = useState<Array<{label: string, value: string}>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const toast = useToast();
  const { updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditLegalFormProps>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      nome: userData?.nome || '',
      nome_fantasia: userData?.nome_fantasia || '',
      num_documento: userData?.num_documento || '',
      email: userData?.email || '',
      celular: userData?.celular || '',
      telefone: userData?.telefone || '',
      cep: userData?.cep || '',
      logradouro: userData?.logradouro || '',
      bairro: userData?.bairro || '',
      numero: userData?.numero || '',
      complemento: userData?.complemento || '',
      nome_responsavel: userData?.nome_responsavel || '',
      cpf_responsavel: userData?.cpf_responsavel || '',
      id_cidade: userData?.id_cidade || 0,
      inscricao_estadual: userData?.inscricao_estadual || '',
      rg: userData?.rg || '',
      senhaAtual: '',
      senha: '',
      confirmacao: '',
    },
  });

  useEffect(() => {
    reset({
      nome: userData?.nome || '',
      nome_fantasia: userData?.nome_fantasia || '',
      num_documento: userData?.num_documento || '',
      email: userData?.email || '',
      celular: userData?.celular || '',
      telefone: userData?.telefone || '',
      cep: userData?.cep || '',
      logradouro: userData?.logradouro || '',
      bairro: userData?.bairro || '',
      numero: userData?.numero || '',
      complemento: userData?.complemento || '',
      nome_responsavel: userData?.nome_responsavel || '',
      cpf_responsavel: userData?.cpf_responsavel || '',
      id_cidade: userData?.id_cidade || 0,
      inscricao_estadual: userData?.inscricao_estadual || '',
      rg: userData?.rg || '',
      senhaAtual: '',
      senha: '',
      confirmacao: '',
    });
    
    // Buscar lista inicial de cidades
    loadCities('');
  }, [userData]);

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

  const handleUpdateProfile = async (data: EditLegalFormProps) => {
    setIsLoading(true);

    try {
      const updateData: any = {
        nome: data.nome,
        nome_fantasia: data.nome_fantasia,
        num_documento: data.num_documento,
        email: data.email,
        celular: data.celular,
        telefone: data.telefone,
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        numero: data.numero,
        complemento: data.complemento,
        nome_responsavel: data.nome_responsavel,
        cpf_responsavel: data.cpf_responsavel,
        id_cidade: data.id_cidade, // Apenas id_cidade
        inscricao_estadual: data.inscricao_estadual,
        rg: data.rg,
      };

      const response = await api.post('/cliente/minha_conta/salvar', updateData);
      
      if (response.data && response.data.status === 'success') {
        const updatedUser = { ...userData, ...updateData };
        await updateUserProfile(updatedUser);
        toast.show('Perfil atualizado com sucesso!', { type: 'success' });
        onUpdate();
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
      toast.show(errorMessage, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (data: EditLegalFormProps) => {
    if (!data.senha || !data.confirmacao) {
      toast.show('Preencha todos os campos de senha', { type: 'warning' });
      return;
    }

    if (data.senha !== data.confirmacao) {
      toast.show('A confirmação da senha não confere!', { type: 'danger' });
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        nova_senha: data.senha,
      };

      console.log('handleUpdatePassword updateData:', updateData);
      const response = await api.post('/cliente/minha_conta/salvar', updateData);
      console.log('handleUpdatePassword response:', response.data);
      
      if (response.data && response.data.status === 'success') {
        toast.show('Senha alterada com sucesso!', { type: 'success' });
        // Limpar campos de senha
        setValue('senhaAtual', '');
        setValue('senha', '');
        setValue('confirmacao', '');
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao alterar senha. Tente novamente.';
      toast.show(errorMessage, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };


  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = unmask(cep);
    
    if (cleanCep.length !== 8) return;

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);

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


  return (
    <L.Container>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Razão Social"
            value={value}
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.nome?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="nome_fantasia"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nome Fantasia"
            value={value}
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="E-mail"
            value={value}
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Número"
            value={value}
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Complemento"
            value={value}
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
        name="inscricao_estadual"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Inscrição Estadual"
            value={value}
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.inscricao_estadual?.message}
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
        name="nome_responsavel"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nome do Responsável"
            value={value}
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
        </L.DocumentsContainer>


      <View
        style={{
            alignItems: "center",
            flex: 1,
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 30
        }}
      >
        <BasicButton
        label="Salvar"
        onPress={handleSubmit(handleUpdateProfile)}
        backgroundColor='#9A0B26'
        color='white'
        disabled={isLoading}
        />
      </View>

      <View
        style={{
          marginTop: 30
        }}
      >
        <Text color="brand-red-dark" fontStyle="p-18-bold">
          Altere a sua senha aqui
        </Text>

        <View
          style={{
            marginTop: 30
          }}
        >
          <Controller
            control={control}
            name="senhaAtual"
            render={({ field: { onChange } }) => (
              <TextInput
                label="Senha Atual"
                autoCapitalize="none"
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                showPasswordButton
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
              />
            )}
          />

          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange } }) => (
              <TextInput
                label="NOVA senha"
                autoCapitalize="none"
                onChangeText={onChange}
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
                label="Confirme a nova senha"
                autoCapitalize="none"
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                showPasswordButton
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
              />
            )}
          />
        </View>

        <View
          style={{
              alignItems: "center",
              flex: 1,
              width: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 30
          }}
        >
          <BasicButton
          label="Alterar a senha"
          onPress={handleSubmit(handleUpdatePassword)}
          backgroundColor='#9A0B26'
          color='white'
          disabled={isLoading}
          />
        </View>

      </View>
      
      <L.Spacer />
    </L.Container>
  );
};

export default EditLegal;
