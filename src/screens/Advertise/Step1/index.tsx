import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput as RNTextInput, Alert } from 'react-native';
import { Text, TextInput, ProgressSteps, Select } from '@components/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import PageScaffold from '@components/PageScaffold';
import { SvgXml } from 'react-native-svg';
import BasicButton from '@components/BasicButton';
import { CarIcon } from '@icons/CarIcon';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@lib/api';
import { maskPlaca } from '@utils/masks';
import { useAdvertise } from '../context/AdvertiseContext';

const convertFipeValueToNumeric = (valorFipe: string): string => {
  if (!valorFipe) return '0';

  let valor = valorFipe
    .replace(/R\$\s*/g, '') 
    .replace(/\./g, '')     
    .replace(',', '.');     

  const numero = parseFloat(valor);
  return isNaN(numero) ? '0' : numero.toFixed(2);
};

type Step1NavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseStep1'>;

interface VehicleFormProps {
  placa: string;
  marca: string;
  modelo: string;
  ano_fabricacao: string;
  ano_modelo: string;
  quilometragem: string;
  cor: string;
  cambio: string;
  combustivel: string;
  portas: string;
}

const vehicleSchema = yup.object({
  placa: yup.string().required('Informe a placa!'),
  marca: yup.string().required('Informe a marca!'),
  modelo: yup.string().required('Informe o modelo!'),
  ano_fabricacao: yup.string().required('Selecione o ano de fabricação!'),
  ano_modelo: yup.string().required('Selecione o ano do modelo!'),
  quilometragem: yup.string().required('Informe a quilometragem!'),
  cor: yup.string().required('Selecione a cor!'),
  cambio: yup.string().required('Selecione o câmbio!'),
  combustivel: yup.string().required('Selecione o combustível!'),
  portas: yup.string().required('Selecione o número de portas!'),
});

const Step1 = () => {
  const navigation = useNavigation<Step1NavigationProp>();
  const route = useRoute();
  const { updateStep1Data, parameters, advertiseData, loadAdDataForEdit, clearEditCache } = useAdvertise();
  
  const editCodigo = (route.params as any)?.editCodigo;
  const shouldPublish = (route.params as any)?.shouldPublish;
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormProps>({
    resolver: yupResolver(vehicleSchema),
  });

  useEffect(() => {
    const loadDataForEdit = async () => {
      if (editCodigo) {
        try {
          setIsLoadingEditData(true);

          const isAlreadyEditing = advertiseData.id !== undefined && advertiseData.id !== null;
          
          if (!isAlreadyEditing) {
            
            clearEditCache();
            await loadAdDataForEdit(editCodigo);
          }

          if (shouldPublish) {
            updateStep1Data({ shouldPublish: true });
          }
        } catch (error) {
          Alert.alert(
            'Erro',
            'Não foi possível carregar os dados do anúncio. Tente novamente.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack()
              }
            ]
          );
        } finally {
          setIsLoadingEditData(false);
        }
      }
    };

    loadDataForEdit();
  }, [editCodigo, shouldPublish]);

  useEffect(() => {
    if (advertiseData.id || (editCodigo && advertiseData.placa)) {
      if (advertiseData.placa) setValue('placa', advertiseData.placa);
      if (advertiseData.marca_veiculo) setValue('marca', advertiseData.marca_veiculo);
      if (advertiseData.modelo_veiculo) setValue('modelo', advertiseData.modelo_veiculo);
      if (advertiseData.ano_fabricacao) setValue('ano_fabricacao', advertiseData.ano_fabricacao);
      if (advertiseData.ano_modelo) setValue('ano_modelo', advertiseData.ano_modelo);
      if (advertiseData.quilometragem) setValue('quilometragem', advertiseData.quilometragem);
      if (advertiseData.id_cor) setValue('cor', advertiseData.id_cor);
      if (advertiseData.id_tipo_cambio) setValue('cambio', advertiseData.id_tipo_cambio);
      if (advertiseData.id_tipo_combustivel) setValue('combustivel', advertiseData.id_tipo_combustivel);
      if (advertiseData.num_portas) setValue('portas', advertiseData.num_portas);
    }
  }, [advertiseData.id, advertiseData.placa, advertiseData.marca_veiculo, advertiseData.modelo_veiculo, editCodigo, setValue]);

  const formValues = watch();
  
  const isFormValid = !!(
    formValues.placa &&
    formValues.marca &&
    formValues.modelo &&
    formValues.ano_fabricacao &&
    formValues.ano_modelo &&
    formValues.quilometragem &&
    formValues.cor &&
    formValues.cambio &&
    formValues.combustivel &&
    formValues.portas
  );

  const [anoFabricacaoOptions, setAnoFabricacaoOptions] = useState<Array<{label: string, value: string}>>([]);
  const [anoModeloOptions, setAnoModeloOptions] = useState<Array<{label: string, value: string}>>([]);
  const [portasOptions] = useState([
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ]);

  const placa = watch('placa');
  const modelo = watch('modelo');
  const [isLoadingVehicleInfo, setIsLoadingVehicleInfo] = useState(false);

  const extractSubmodelo = (modeloCompleto: string): string => {
    if (!modeloCompleto) return '';
    
    const palavras = modeloCompleto.trim().split(/\s+/);
    return palavras[0] || '';
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 2000; year--) {
      years.push({ label: year.toString(), value: year.toString() });
    }
    return years;
  };

  const coresOptions = parameters.cores.map(cor => ({
    label: cor.descricao,
    value: cor.id.toString(),
  }));

  const tiposCambioOptions = parameters.tiposCambio.map(cambio => ({
    label: cambio.descricao,
    value: cambio.id.toString(),
  }));

  const tiposCombustivelOptions = parameters.tiposCombustivel.map(combustivel => ({
    label: combustivel.descricao,
    value: combustivel.id.toString(),
  }));

  useEffect(() => {
    
    const anos = generateYearOptions();
    setAnoFabricacaoOptions(anos);
    setAnoModeloOptions(anos);
  }, []);

  useEffect(() => {
    
    if (!placa || placa.length < 7) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const fetchVehicleInfo = async () => {
        if (placa && placa.length === 8 && !isLoadingVehicleInfo) { 
          setIsLoadingVehicleInfo(true);
          try {
            const response = await api.post('/cliente/meus_anuncios/obter_info_veiculo', {
              placa: placa.replace(/-/g, ''), 
            });

            if (response.data.status === 'success') {
              const data = response.data.content;

              if (data.marca) setValue('marca', data.marca);
              if (data.modelo) setValue('modelo', data.modelo);
              if (data.ano_fabricacao) setValue('ano_fabricacao', data.ano_fabricacao.toString());
              if (data.ano_modelo) setValue('ano_modelo', data.ano_modelo.toString());

              if (data.submodelo || data.modelo) {
                const submodelo = data.submodelo || extractSubmodelo(data.modelo);

                let valorFipeConvertido = null;
                if (data.valor_fipe) {
                  valorFipeConvertido = convertFipeValueToNumeric(data.valor_fipe);
                }
                
                updateStep1Data({
                  submodelo: submodelo,
                  valor_fipe: valorFipeConvertido || undefined,
                });
              }
            }
          } catch (error) {
          } finally {
            setIsLoadingVehicleInfo(false);
          }
        }
      };

      fetchVehicleInfo();
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, [placa, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'modelo' && value.modelo) {
        const submodelo = extractSubmodelo(value.modelo);
        updateStep1Data({
          submodelo: submodelo,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateStep1Data, extractSubmodelo]);

  const handleContinue = (data: VehicleFormProps) => {

    updateStep1Data({
      placa: data.placa,
      marca_veiculo: data.marca,
      modelo_veiculo: data.modelo,
      ano_fabricacao: data.ano_fabricacao,
      ano_modelo: data.ano_modelo,
      quilometragem: data.quilometragem,
      id_cor: data.cor,
      id_tipo_cambio: data.cambio,
      id_tipo_combustivel: data.combustivel,
      num_portas: data.portas,
    });
    
    navigation.navigate('advertiseStep2');
  };

  const isEditing = !!advertiseData.id;

  if (isLoadingEditData) {
    return (
      <PageScaffold
        titleText={'Carregando anúncio'}
        titleIcon={<SvgXml xml={CarIcon()} width={20} height={20} />}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <Text fontStyle="p-14-regular" color="gray-500" style={{ marginTop: 16 }}>
            Carregando dados do anúncio...
          </Text>
        </View>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      titleText={isEditing ? 'Editar meu anúncio' : 'Anunciar meu veículo'}
      titleIcon={<SvgXml xml={CarIcon()} width={20} height={20} />}
      floatingButton={
        <View style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          paddingHorizontal: 30,
          paddingVertical: 10,
        }}>
          <BasicButton
            label="Continuar"
            onPress={handleSubmit(handleContinue)}
            backgroundColor='#9A0B26'
            color='white'
            disabled={!isFormValid}
          />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <ProgressSteps currentStep={1} />
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <Text fontStyle="p-16-bold" color="gray-500" style={{marginBottom: 30}}>
            Dados do Veículo
          </Text>
          
          <View style={{ 
            height: 80,
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Controller
              control={control}
              name="placa"
              render={({ field: { onChange, value } }) => (
                <View style={{ width: 250 }}>
                  <Text 
                    color="black"
                    style={{ 
                      fontFamily: 'MontserratRegular',
                      marginTop: 8,
                      marginBottom: 10,
                      textAlign: 'center'
                    }}
                  >
                    Placa
                  </Text>
                  <View style={{
                    backgroundColor: '#F3F2ED',
                    borderRadius: 8,
                    height: 40,
                    justifyContent: 'center',
                    borderWidth: errors.placa ? 1 : 0,
                    borderColor: errors.placa ? 'red' : 'transparent'
                  }}>
                    <RNTextInput
                      value={value}
                      onChangeText={(text) => onChange(maskPlaca(text))}
                      placeholder="ABC-1234"
                      maxLength={8}
                      style={{
                        textAlign: 'center',
                        fontFamily: 'MontserratRegular',
                        fontSize: 16,
                        paddingHorizontal: 10,
                        color: '#000'
                      }}
                      placeholderTextColor="#999"
                    />
                  </View>
                  {errors.placa && (
                    <Text 
                      color="red"
                      style={{
                        fontSize: 10,
                        marginTop: 2,
                        textAlign: 'center'
                      }}
                    >
                      {errors.placa.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <Controller
            control={control}
            name="marca"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Marca"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.marca?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="modelo"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Modelo"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.modelo?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="ano_fabricacao"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Select
                  label="Ano de Fabricação"
                  placeholder="Selecione o ano de fabricação"
                  options={anoFabricacaoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  error={errors.ano_fabricacao?.message}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="ano_modelo"
            render={({ field: { onChange, value } }) => (
              <View>
                <Select
                  label="Ano Modelo"
                  placeholder="Selecione o ano do modelo"
                  options={anoModeloOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  error={errors.ano_modelo?.message}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="quilometragem"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Quilometragem"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.quilometragem?.message}
                keyboardType="numeric"
                placeholder="Ex: 50000"
              />
            )}
          />

          <Controller
            control={control}
            name="cor"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Select
                  label="Cor"
                  placeholder="Selecione uma opção"
                  options={coresOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  error={errors.cor?.message}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="cambio"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 10 }}>
                <Select
                  label="Câmbio"
                  placeholder="Selecione uma opção"
                  options={tiposCambioOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  error={errors.cambio?.message}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="combustivel"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 10 }}>
                <Select
                  label="Combustível"
                  placeholder="Selecione uma opção"
                  options={tiposCombustivelOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  error={errors.combustivel?.message}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="portas"
            render={({ field: { onChange, value } }) => (
              <View>
                <Select
                  label="Portas"
                  placeholder="Selecione uma opção"
                  options={portasOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  error={errors.portas?.message}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                />
              </View>
            )}
          />
        </View>
      </View>
    </PageScaffold>
  );
};

export default Step1;
