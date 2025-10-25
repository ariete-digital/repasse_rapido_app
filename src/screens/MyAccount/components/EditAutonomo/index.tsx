import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

import TextInput from '@components/TextInput';
import Text from '@components/Text';
import BasicButton from '@components/BasicButton';
import Select from '@components/Select';
import ImagePickerExample from '../FilePicker';
import { api } from '@lib/api';
import { useAuth } from '@hooks/useAuth';
import { UserDTO } from '@lib/storage/storageUser';
import * as I from './styles';
import { View } from 'react-native';
import axios from 'axios';
import { maskCPF, maskPhone, maskCEP, unmask } from '@utils/masks';

const editSchema = yup.object({
  nome: yup.string().required('Informe o nome completo!'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido.'),
  num_documento: yup.string().required('Informe o CPF!'),
  telefone: yup.string().required('Informe o telefone!'),
  cep: yup.string().required('Informe o CEP!'),
  logradouro: yup.string().required('Informe o endereço!'),
  numero: yup.string().required('Informe o número!'),
  complemento: yup.string().optional(),
  bairro: yup.string().required('Informe o bairro!'),
  id_cidade: yup.number(),
  senhaAtual: yup.string().optional(),
  senha: yup.string().optional(),
  confirmacao: yup.string().optional(),
});

interface EditAutonomoFormProps {
  nome: string;
  email: string;
  num_documento: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  id_cidade?: number;
  senhaAtual?: string;
  senha?: string;
  confirmacao?: string;
}

interface EditAutonomoProps {
  userData: UserDTO;
  onUpdate: () => void;
}

const EditAutonomo = ({ userData, onUpdate }: EditAutonomoProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [citiesOptions, setCitiesOptions] = useState<Array<{label: string, value: string}>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const toast = useToast();
  const { updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditAutonomoFormProps>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      nome: userData?.nome || '',
      email: userData?.email || '',
      num_documento: userData?.num_documento || '',
      telefone: userData?.telefone || '',
      cep: userData?.cep || '',
      logradouro: userData?.logradouro || '',
      numero: userData?.numero || '',
      complemento: userData?.complemento || '',
      bairro: userData?.bairro || '',
      id_cidade: userData?.id_cidade || 0,
      senhaAtual: '',
      senha: '',
      confirmacao: '',
    },
  });

  useEffect(() => {
    reset({
      nome: userData?.nome || '',
      email: userData?.email || '',
      num_documento: userData?.num_documento || '',
      telefone: userData?.telefone || '',
      cep: userData?.cep || '',
      logradouro: userData?.logradouro || '',
      numero: userData?.numero || '',
      complemento: userData?.complemento || '',
      bairro: userData?.bairro || '',
      id_cidade: userData?.id_cidade || 0,
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

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = unmask(cep);
    
    if (cleanCep.length !== 8) return;

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (response.data && !response.data.erro) {
        const { bairro, logradouro, localidade } = response.data;
        setValue('bairro', bairro);
        setValue('logradouro', logradouro);
        
        // Buscar id_cidade
        try {
          const cityData = await api.get(`/cliente/listagem/todas_cidades?filtro=${localidade}`);
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

  const handleUpdateProfile = async (data: EditAutonomoFormProps) => {
    setIsLoading(true);

    try {
      const updateData: any = {
        nome: data.nome,
        email: data.email,
        num_documento: data.num_documento,
        telefone: data.telefone,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        id_cidade: data.id_cidade, // Apenas id_cidade
      };

      console.log('handleUpdateProfile updateData:', updateData);

      const response = await api.post('/cliente/minha_conta/salvar', updateData);
      
      console.log('handleUpdateProfile response:', response.data);

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

  const handleUpdatePassword = async (data: EditAutonomoFormProps) => {
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

  return (
    <I.Container>
      <Text fontStyle="p-18-bold" color="brand-red-dark" style={{ marginBottom: 20 }}>
        Dados Pessoais
      </Text>
      
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nome Completo"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.nome?.message}
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
            autoCapitalize="none"
            onChangeText={onChange}
            errorMessage={errors.email?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="num_documento"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="CPF"
            value={maskCPF(value || '')}
            keyboardType="numeric"
            onChangeText={(text) => onChange(text)}
            errorMessage={errors.num_documento?.message}
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
        name="logradouro"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Endereço"
            value={value}
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

      <View style={{ marginTop: 24, gap: 8 }}>
        <Text color="black" fontStyle="p-16-bold">
          Documentos
        </Text>
        <Text color="black" fontStyle="p-14-bold" spacingY={12}>
          CNH
        </Text>
        <ImagePickerExample />
        <Text color="black" spacingY={12} style={{marginTop: 30}}>
          <Text color="black-700" fontStyle="p-14-bold">
            Comprovante de endereço recente.
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
          label="Salvar"
          onPress={handleSubmit(handleUpdateProfile)}
          backgroundColor='#9A0B26'
          color='white'
          disabled={isLoading}
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text color="brand-red-dark" fontStyle="p-18-bold">
          Altere a sua senha aqui
        </Text>

        <View style={{ marginTop: 30 }}>
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
      
      <I.Spacer />
    </I.Container>
  );
};

export default EditAutonomo;
