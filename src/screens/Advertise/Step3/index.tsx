import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import BasicButton from '@components/BasicButton';
import { useAdvertise } from '../context/AdvertiseContext';
import PageScaffold from '@components/PageScaffold';
import ProgressSteps from '@components/ProgressSteps';
import { SvgXml } from 'react-native-svg';
import { CarIcon } from '@icons/CarIcon';
import { Text, Select } from '@components/index';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Step3NavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseStep3'>;

interface VehicleFormProps {
  status_veiculo: string;
  unico_dono: string;
  ipva_pago: string;
  veiculo_nome_anunciante: string;
  financiado: string;
  parcelas_em_dia: string;
  todas_revisoes_concessionaria: string;
  possui_manual: string;
  possui_chave_reserva: string;
  possui_ar: string;
  ar_funcionando: string;
  escapamento_solta_fumaca: string;
  garantia_fabrica: string;
  motor_bate: string;
  cambio_faz_barulho: string;
  cambio_escapa_marcha: string;
  furtado_roubado: string;
  id_tipo_pneu: string;
  id_tipo_parabrisa: string;
  luz_injecao: string;
  luz_airbag: string;
  luz_abs: string;
  tipo_monta: string;
  passou_leilao: string;
}

const vehicleSchema = yup.object({
  status_veiculo: yup.string().required('Selecione uma opção!'),
  unico_dono: yup.string().required('Selecione uma opção!'),
  ipva_pago: yup.string().required('Selecione uma opção!'),
  veiculo_nome_anunciante: yup.string().required('Selecione uma opção!'),
  financiado: yup.string().required('Selecione uma opção!'),
  parcelas_em_dia: yup.string().required('Selecione uma opção!'),
  todas_revisoes_concessionaria: yup.string().required('Selecione uma opção!'),
  possui_manual: yup.string().required('Selecione uma opção!'),
  possui_chave_reserva: yup.string().required('Selecione uma opção!'),
  possui_ar: yup.string().required('Selecione uma opção!'),
  ar_funcionando: yup.string().required('Selecione uma opção!'),
  escapamento_solta_fumaca: yup.string().required('Selecione uma opção!'),
  garantia_fabrica: yup.string().required('Selecione uma opção!'),
  motor_bate: yup.string().required('Selecione uma opção!'),
  cambio_faz_barulho: yup.string().required('Selecione uma opção!'),
  cambio_escapa_marcha: yup.string().required('Selecione uma opção!'),
  furtado_roubado: yup.string().required('Selecione uma opção!'),
  id_tipo_pneu: yup.string().required('Selecione uma opção!'),
  id_tipo_parabrisa: yup.string().required('Selecione uma opção!'),
  luz_injecao: yup.string().required('Selecione uma opção!'),
  luz_airbag: yup.string().required('Selecione uma opção!'),
  luz_abs: yup.string().required('Selecione uma opção!'),
  tipo_monta: yup.string().required('Selecione uma opção!'),
  passou_leilao: yup.string().required('Selecione uma opção!'),
});

// Opções padrão para campos Sim/Não (valores numéricos para API)
const yesNoOptions = [
  { label: 'Sim', value: '1' },
  { label: 'Não', value: '0' },
];

const financiadoOptions = [
  { label: 'Sim', value: '1' },
  { label: 'Não', value: '0' },
];

const parcelasEmDiaOptions = [
  { label: 'Sim', value: '1' },
  { label: 'Não', value: '0' },
  { label: 'Não se aplica', value: '2' },
];

const tipoMontaOptions = [
  { label: 'Não ocorrido', value: 'N' },
  { label: 'Pequena', value: 'P' },
  { label: 'Média', value: 'M' },
  { label: 'Grande', value: 'G' },
];

const statusVeiculoOptions = [
  { label: 'Novo', value: 'N' },
  { label: 'Usado', value: 'U' },
];

interface OptionItem {
  id: number;
  descricao: string;
}

const Step3 = () => {
  const navigation = useNavigation<Step3NavigationProp>();
  const { updateStep3Data, parameters, advertiseData } = useAdvertise();

  // Usar opções dos parâmetros
  const tiposPneuOptions = parameters.tiposPneu;
  const tiposParabrisaOptions = parameters.tiposParabrisa;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormProps>({
    resolver: yupResolver(vehicleSchema),
  });

  // Preencher campos se estiver editando
  useEffect(() => {
    if (advertiseData.id || advertiseData.status_veiculo || advertiseData.unico_dono) {
      if (advertiseData.status_veiculo) setValue('status_veiculo', advertiseData.status_veiculo);
      if (advertiseData.unico_dono) setValue('unico_dono', advertiseData.unico_dono);
      if (advertiseData.ipva_pago) setValue('ipva_pago', advertiseData.ipva_pago);
      if (advertiseData.veiculo_nome_anunciante) setValue('veiculo_nome_anunciante', advertiseData.veiculo_nome_anunciante);
      if (advertiseData.financiado) setValue('financiado', advertiseData.financiado);
      if (advertiseData.parcelas_em_dia) setValue('parcelas_em_dia', advertiseData.parcelas_em_dia);
      if (advertiseData.todas_revisoes_concessionaria) setValue('todas_revisoes_concessionaria', advertiseData.todas_revisoes_concessionaria);
      if (advertiseData.possui_manual) setValue('possui_manual', advertiseData.possui_manual);
      if (advertiseData.possui_chave_reserva) setValue('possui_chave_reserva', advertiseData.possui_chave_reserva);
      if (advertiseData.possui_ar) setValue('possui_ar', advertiseData.possui_ar);
      if (advertiseData.ar_funcionando) setValue('ar_funcionando', advertiseData.ar_funcionando);
      if (advertiseData.escapamento_solta_fumaca) setValue('escapamento_solta_fumaca', advertiseData.escapamento_solta_fumaca);
      if (advertiseData.garantia_fabrica) setValue('garantia_fabrica', advertiseData.garantia_fabrica);
      if (advertiseData.motor_bate) setValue('motor_bate', advertiseData.motor_bate);
      if (advertiseData.cambio_faz_barulho) setValue('cambio_faz_barulho', advertiseData.cambio_faz_barulho);
      if (advertiseData.cambio_escapa_marcha) setValue('cambio_escapa_marcha', advertiseData.cambio_escapa_marcha);
      if (advertiseData.furtado_roubado) setValue('furtado_roubado', advertiseData.furtado_roubado);
      if (advertiseData.id_tipo_pneu) setValue('id_tipo_pneu', advertiseData.id_tipo_pneu);
      if (advertiseData.id_tipo_parabrisa) setValue('id_tipo_parabrisa', advertiseData.id_tipo_parabrisa);
      if (advertiseData.luz_injecao) setValue('luz_injecao', advertiseData.luz_injecao);
      if (advertiseData.luz_airbag) setValue('luz_airbag', advertiseData.luz_airbag);
      if (advertiseData.luz_abs) setValue('luz_abs', advertiseData.luz_abs);
      if (advertiseData.tipo_monta) setValue('tipo_monta', advertiseData.tipo_monta);
      if (advertiseData.passou_leilao) setValue('passou_leilao', advertiseData.passou_leilao);
    }
  }, [advertiseData.id, advertiseData.status_veiculo, advertiseData.unico_dono, setValue]);

  // Monitorar todos os campos
  const formValues = watch();
  
  // Validação customizada: verifica se todos os campos obrigatórios estão preenchidos
  const isFormValid = !!(
    formValues.status_veiculo &&
    formValues.unico_dono &&
    formValues.ipva_pago &&
    formValues.veiculo_nome_anunciante &&
    formValues.financiado &&
    formValues.parcelas_em_dia &&
    formValues.todas_revisoes_concessionaria &&
    formValues.possui_manual &&
    formValues.possui_chave_reserva &&
    formValues.possui_ar &&
    formValues.ar_funcionando &&
    formValues.escapamento_solta_fumaca &&
    formValues.garantia_fabrica &&
    formValues.motor_bate &&
    formValues.cambio_faz_barulho &&
    formValues.cambio_escapa_marcha &&
    formValues.furtado_roubado &&
    formValues.id_tipo_pneu &&
    formValues.id_tipo_parabrisa &&
    formValues.luz_injecao &&
    formValues.luz_airbag &&
    formValues.luz_abs &&
    formValues.tipo_monta &&
    formValues.passou_leilao
  );

  const isEditing = !!advertiseData.id;

  const handleContinue = (data: VehicleFormProps) => {
    
    // Salvar dados no contexto
    updateStep3Data({
      status_veiculo: data.status_veiculo,
      unico_dono: data.unico_dono,
      ipva_pago: data.ipva_pago,
      veiculo_nome_anunciante: data.veiculo_nome_anunciante,
      financiado: data.financiado,
      parcelas_em_dia: data.parcelas_em_dia,
      todas_revisoes_concessionaria: data.todas_revisoes_concessionaria,
      possui_manual: data.possui_manual,
      possui_chave_reserva: data.possui_chave_reserva,
      possui_ar: data.possui_ar,
      ar_funcionando: data.ar_funcionando,
      escapamento_solta_fumaca: data.escapamento_solta_fumaca,
      garantia_fabrica: data.garantia_fabrica,
      motor_bate: data.motor_bate,
      cambio_faz_barulho: data.cambio_faz_barulho,
      cambio_escapa_marcha: data.cambio_escapa_marcha,
      furtado_roubado: data.furtado_roubado,
      id_tipo_pneu: data.id_tipo_pneu,
      id_tipo_parabrisa: data.id_tipo_parabrisa,
      luz_injecao: data.luz_injecao,
      luz_airbag: data.luz_airbag,
      luz_abs: data.luz_abs,
      tipo_monta: data.tipo_monta,
      passou_leilao: data.passou_leilao,
    });
    
    navigation.navigate('advertiseStep4');
  };


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
          <ProgressSteps currentStep={3} />
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <Text fontStyle="p-16-bold" color="gray-500" style={{marginBottom: 30}}>
            Dados do Veículo
          </Text>

          {/* 1. Status do Veículo */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="status_veiculo"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Status do Veículo"
                  placeholder="Selecione uma opção"
                  options={statusVeiculoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.status_veiculo?.message}
                />
              )}
            />
          </View>

          {/* 2. Dono */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="unico_dono"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Dono"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.unico_dono?.message}
                />
              )}
            />
          </View>

          {/* 2. IPVA pago integralmente? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="ipva_pago"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="IPVA pago integralmente?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.ipva_pago?.message}
                />
              )}
            />
          </View>

          {/* 3. Veículo no nome do anunciante? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="veiculo_nome_anunciante"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Veículo no nome do anunciante?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.veiculo_nome_anunciante?.message}
                />
              )}
            />
          </View>

          {/* 4. Financiado? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="financiado"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Financiado?"
                  placeholder="Selecione uma opção"
                  options={financiadoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.financiado?.message}
                />
              )}
            />
          </View>

          {/* 5. Parcelas em dia? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="parcelas_em_dia"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Parcelas em dia?"
                  placeholder="Selecione uma opção"
                  options={parcelasEmDiaOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.parcelas_em_dia?.message}
                />
              )}
            />
          </View>

          {/* 6. Revisões em concessionária? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="todas_revisoes_concessionaria"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Revisões em concessionária?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.todas_revisoes_concessionaria?.message}
                />
              )}
            />
          </View>

          {/* 7. Possui manual do proprietário? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="possui_manual"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Possui manual do proprietário?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.possui_manual?.message}
                />
              )}
            />
          </View>

          {/* 8. Possui chave reserva? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="possui_chave_reserva"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Possui chave reserva?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.possui_chave_reserva?.message}
                />
              )}
            />
          </View>

          {/* 9. Veículo possui ar condicionado? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="possui_ar"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Veículo possui ar condicionado?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.possui_ar?.message}
                />
              )}
            />
          </View>

          {/* 10. Ar condicionado em perfeito funcionamento? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="ar_funcionando"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Ar condicionado em perfeito funcionamento?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.ar_funcionando?.message}
                />
              )}
            />
          </View>

          {/* 11. Escapamento solta fumaça? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="escapamento_solta_fumaca"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Escapamento solta fumaça?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.escapamento_solta_fumaca?.message}
                />
              )}
            />
          </View>

          {/* 12. Garantia de fábrica? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="garantia_fabrica"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Garantia de fábrica?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.garantia_fabrica?.message}
                />
              )}
            />
          </View>

          {/* 13. Motor bate ou raja? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="motor_bate"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Motor bate ou raja?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.motor_bate?.message}
                />
              )}
            />
          </View>

          {/* 14. Câmbio faz barulho estranho? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="cambio_faz_barulho"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Câmbio faz barulho estranho?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.cambio_faz_barulho?.message}
                />
              )}
            />
          </View>

          {/* 15. Câmbio escapa alguma marcha? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="cambio_escapa_marcha"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Câmbio escapa alguma marcha?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.cambio_escapa_marcha?.message}
                />
              )}
            />
          </View>

          {/* 16. Já foi furtado ou roubado? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="furtado_roubado"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Já foi furtado ou roubado?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.furtado_roubado?.message}
                />
              )}
            />
          </View>

          {/* 17. Estado dos Pneus */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="id_tipo_pneu"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Estado dos Pneus"
                  placeholder="Selecione uma opção"
                  options={tiposPneuOptions.map(opt => ({ label: opt.descricao, value: opt.id.toString() }))}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.id_tipo_pneu?.message}
                />
              )}
            />
          </View>

          {/* 18. Parabrisa */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="id_tipo_parabrisa"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Parabrisa"
                  placeholder="Selecione uma opção"
                  options={tiposParabrisaOptions.map(opt => ({ label: opt.descricao, value: opt.id.toString() }))}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.id_tipo_parabrisa?.message}
                />
              )}
            />
          </View>

          {/* 19. Alguma luz de injeção acesa? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="luz_injecao"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Alguma luz de injeção acesa?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.luz_injecao?.message}
                />
              )}
            />
          </View>

          {/* 20. Alguma luz de airbag acesa? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="luz_airbag"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Alguma luz de airbag acesa?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.luz_airbag?.message}
                />
              )}
            />
          </View>

          {/* 21. Alguma luz de ABS acesa? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="luz_abs"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Alguma luz de ABS acesa?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.luz_abs?.message}
                />
              )}
            />
          </View>

          {/* 22. Tipo de colisão ocorrido */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="tipo_monta"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Tipo de colisão ocorrido"
                  placeholder="Selecione uma opção"
                  options={tipoMontaOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.tipo_monta?.message}
                />
              )}
            />
          </View>

          {/* 23. Passou por leilão? */}
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="passou_leilao"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Passou por leilão?"
                  placeholder="Selecione uma opção"
                  options={yesNoOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  labelFontStyle="p-14-regular"
                  placeholderFontStyle="p-14-regular"
                  error={errors.passou_leilao?.message}
                />
              )}
            />
          </View>
        </View>
      </View>
    </PageScaffold>
  );
};

export default Step3;
