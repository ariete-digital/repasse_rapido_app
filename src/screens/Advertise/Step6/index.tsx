import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import ProgressSteps from '@components/ProgressSteps';
import PageScaffold from '@components/PageScaffold';
import { SvgXml } from 'react-native-svg';
import { CarIcon } from '@icons/CarIcon';
import { Text } from '@components/index';
import BasicButton from '@components/BasicButton';
import { useAdvertise } from '../context/AdvertiseContext';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '@lib/api';

type Step6NavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseStep6'>;

const Step6 = () => {
  const navigation = useNavigation<Step6NavigationProp>();
  const { advertiseData, clearAdvertiseData } = useAdvertise();
  const { user } = useAuth();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'oficial' | 'gratis' | null>('oficial');

  // Determinar se o usuário precisa selecionar plano
  const needsPlanSelection = user.tipo === 'A' || user.tipo === 'PJ';

  // Validar se pode prosseguir
  const canProceed = needsPlanSelection 
    ? selectedPlan !== null  // Para A/PJ: precisa selecionar plano
    : agreeTerms;            // Para PF: precisa aceitar termos

  // Função auxiliar para converter string '1'/'0' para boolean
  const stringToBoolean = (value: string | undefined): boolean => {
    return value === '1' || value === 'true';
  };

  // Função auxiliar para converter string para number
  const stringToNumber = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  };

  // Função auxiliar para converter imagem para base64 usando fetch
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      // Buscar a imagem como blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Converter blob para base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result); // Já vem com o prefixo data:image/jpeg;base64,
          } else {
            reject(new Error('Failed to convert image to base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const handleSaveAd = async () => {
    // Para usuários PF, validar aceite dos termos
    if (!needsPlanSelection && !agreeTerms) {
      Alert.alert('Atenção', 'Você precisa concordar com os termos para continuar.');
      return;
    }

    // Para usuários A e PJ, validar seleção do plano
    if (needsPlanSelection && !selectedPlan) {
      Alert.alert('Atenção', 'Você precisa selecionar um plano para continuar.');
      return;
    }

    // Validar se há dados mínimos necessários
    const missingFields = [];
    if (!advertiseData.placa) missingFields.push('Placa');
    if (!advertiseData.marca_veiculo) missingFields.push('Marca');
    if (!advertiseData.modelo_veiculo) missingFields.push('Modelo');
    if (!advertiseData.submodelo) missingFields.push('Submodelo');
    if (!advertiseData.ano_fabricacao) missingFields.push('Ano de Fabricação');
    if (!advertiseData.ano_modelo) missingFields.push('Ano do Modelo');
    if (!advertiseData.quilometragem) missingFields.push('Quilometragem');
    if (!advertiseData.id_cor) missingFields.push('Cor');
    if (!advertiseData.id_tipo_cambio) missingFields.push('Câmbio');
    if (!advertiseData.id_tipo_combustivel) missingFields.push('Combustível');
    if (!advertiseData.num_portas) missingFields.push('Número de Portas');
    if (!advertiseData.valor) missingFields.push('Valor');
    if (!advertiseData.descricao) missingFields.push('Descrição');
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Dados Incompletos',
        `Por favor, preencha os seguintes campos:\n\n${missingFields.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== STARTING AD SUBMISSION ===');
      console.log('Consolidating all advertise data:', JSON.stringify(advertiseData, null, 2));

      // Preparar payload JSON
      const payload: any = {
        id_anuncio: advertiseData.id_anuncio || null, // Se tiver ID, está editando
        tipo_veiculo: 'C', // C = Carro
      };

      // Tipo de plano baseado no tipo de usuário
      if (user.tipo === 'A') {
        payload.tipo_plano = 'A';
      } else if (user.tipo === 'PJ') {
        payload.tipo_plano = 'B';
      } else {
        payload.tipo_plano = 'C'; // PF - Pessoa Física
      }

      // Status do veículo (N = Novo, U = Usado)
      if (advertiseData.status_veiculo) {
        payload.status_veiculo = advertiseData.status_veiculo;
      }

      // Step 1 - Dados do Veículo (com conversões de tipo)
      if (advertiseData.placa) {
        payload.placa = advertiseData.placa.replace(/-/g, ''); // Placa sem hífen
      }
      if (advertiseData.marca_veiculo) payload.marca_veiculo = advertiseData.marca_veiculo;
      if (advertiseData.modelo_veiculo) payload.modelo_veiculo = advertiseData.modelo_veiculo;
      if (advertiseData.submodelo) payload.submodelo = advertiseData.submodelo;
      
      // Converter strings para numbers
      if (advertiseData.ano_fabricacao) payload.ano_fabricacao = stringToNumber(advertiseData.ano_fabricacao);
      if (advertiseData.ano_modelo) payload.ano_modelo = stringToNumber(advertiseData.ano_modelo);
      if (advertiseData.quilometragem) payload.quilometragem = stringToNumber(advertiseData.quilometragem);
      if (advertiseData.id_cor) payload.id_cor = stringToNumber(advertiseData.id_cor);
      if (advertiseData.id_tipo_cambio) payload.id_tipo_cambio = stringToNumber(advertiseData.id_tipo_cambio);
      if (advertiseData.id_tipo_combustivel) payload.id_tipo_combustivel = stringToNumber(advertiseData.id_tipo_combustivel);
      if (advertiseData.num_portas) payload.num_portas = stringToNumber(advertiseData.num_portas);

      // Step 2 - Opcionais (já são números)
      if (advertiseData.opcionais && advertiseData.opcionais.length > 0) {
        payload.opcionais = advertiseData.opcionais;
        console.log('Adding opcionais:', advertiseData.opcionais);
      }

      // Step 3 - Dados Detalhados do Veículo (converter strings para booleans)
      payload.unico_dono = stringToBoolean(advertiseData.unico_dono);
      payload.ipva_pago = stringToBoolean(advertiseData.ipva_pago);
      payload.veiculo_nome_anunciante = stringToBoolean(advertiseData.veiculo_nome_anunciante);
      payload.financiado = stringToBoolean(advertiseData.financiado);
      payload.parcelas_em_dia = stringToBoolean(advertiseData.parcelas_em_dia);
      payload.todas_revisoes_concessionaria = stringToBoolean(advertiseData.todas_revisoes_concessionaria);
      payload.possui_manual = stringToBoolean(advertiseData.possui_manual);
      payload.possui_chave_reserva = stringToBoolean(advertiseData.possui_chave_reserva);
      payload.possui_ar = stringToBoolean(advertiseData.possui_ar);
      payload.ar_funcionando = stringToBoolean(advertiseData.ar_funcionando);
      payload.escapamento_solta_fumaca = stringToBoolean(advertiseData.escapamento_solta_fumaca);
      payload.garantia_fabrica = stringToBoolean(advertiseData.garantia_fabrica);
      payload.motor_bate = stringToBoolean(advertiseData.motor_bate);
      payload.cambio_faz_barulho = stringToBoolean(advertiseData.cambio_faz_barulho);
      payload.cambio_escapa_marcha = stringToBoolean(advertiseData.cambio_escapa_marcha);
      payload.furtado_roubado = stringToBoolean(advertiseData.furtado_roubado);
      payload.passou_leilao = stringToBoolean(advertiseData.passou_leilao);
      
      // Campos numéricos do Step 3
      if (advertiseData.id_tipo_pneu) payload.id_tipo_pneu = stringToNumber(advertiseData.id_tipo_pneu);
      if (advertiseData.id_tipo_parabrisa) payload.id_tipo_parabrisa = stringToNumber(advertiseData.id_tipo_parabrisa);
      
      // Tipo de monta - converter string para apropriado
      // '0' = Não colidiu, '1' = Leve, '2' = Moderada, '3' = Forte
      // Pode precisar ser ajustado dependendo de como a API espera
      if (advertiseData.tipo_monta) payload.tipo_monta = advertiseData.tipo_monta;

      // Luzes separadas - se a API espera luz_injecao_airbag único, ajustar aqui
      payload.luz_injecao = stringToBoolean(advertiseData.luz_injecao);
      payload.luz_airbag = stringToBoolean(advertiseData.luz_airbag);
      payload.luz_abs = stringToBoolean(advertiseData.luz_abs);

      // Step 4 - Imagens (converter para base64)
      if (advertiseData.imagens && advertiseData.imagens.length > 0) {
        console.log('Processing images:', advertiseData.imagens.length);
        
        try {
          // Converter todas as imagens para base64
          const base64Images = await Promise.all(
            advertiseData.imagens.map(async (img) => {
              try {
                return await convertImageToBase64(img.uri);
              } catch (error) {
                console.error(`Error converting image ${img.uri}:`, error);
                return null;
              }
            })
          );
          
          // Filtrar imagens que falharam na conversão
          payload.imagens = base64Images.filter(img => img !== null);
          console.log(`Successfully converted ${payload.imagens.length} images to base64`);
        } catch (error) {
          console.error('Error processing images:', error);
          Alert.alert(
            'Erro ao processar imagens',
            'Ocorreu um erro ao processar as imagens. Tente novamente.',
            [{ text: 'OK' }]
          );
          setIsSubmitting(false);
          return;
        }
      } else {
        payload.imagens = [];
        console.log('No images to upload');
      }

      // Step 5 - Valor e Descrição
      if (advertiseData.descricao) payload.descricao = advertiseData.descricao;
      
      // Valor - converter string para number
      if (advertiseData.valor) {
        payload.valor = parseFloat(advertiseData.valor);
      }
      
      // Aceite termos - converter para boolean
      payload.aceite_termos = stringToBoolean(advertiseData.aceite_termos);

      // Step 6 - Plano selecionado (apenas para usuários A e PJ)
      if (needsPlanSelection && selectedPlan) {
        payload.plano_selecionado = selectedPlan;
      }

      // Log de debug
      console.log('=== JSON PAYLOAD ===');
      console.log('Sending JSON to API:', JSON.stringify(payload, null, 2));

      // Enviar para a API com Content-Type: application/json
      const response = await api.post('/cliente/meus_anuncios/salvar', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 segundos de timeout
      });

      console.log('API Response:', response.data);
      console.log('API Response Status:', response.status);

      if (response.data.status === 'success') {
        // A API retorna id_anuncio (não id_anuncio_rascunho)
        const adNumber = response.data.content?.id_anuncio || response.data.content?.id_anuncio_rascunho || advertiseData.id_anuncio || 'N/A';
        
        const isEditing = !!advertiseData.id_anuncio;
        console.log(isEditing ? 'Ad updated successfully' : 'Ad created successfully', 'with ID:', adNumber);
        
        // Limpar dados do contexto
        clearAdvertiseData();
        
        // Mostrar mensagem apropriada
        Alert.alert(
          'Sucesso!',
          isEditing ? 'Anúncio atualizado com sucesso!' : 'Anúncio criado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navegar para tela de sucesso
                navigation.navigate('advertiseSuccess', { adNumber: adNumber.toString() });
              }
            }
          ]
        );
      } else {
        throw new Error(response.data.message || 'Erro ao salvar anúncio');
      }
    } catch (error: any) {
      console.error('Error saving ad:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      setIsSubmitting(false);

      // Tratar erros específicos
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Verificar se há erros de validação específicos de campos
        if (errorData.errors) {
          const firstError = Object.keys(errorData.errors)[0];
          const errorMessage = errorData.errors[firstError][0];
          
          Alert.alert(
            'Erro de Validação',
            `Campo: ${firstError}\n${errorMessage}\n\nPor favor, volte e corrija o erro.`,
            [
              { text: 'OK', onPress: () => {
                // Redirecionar para a etapa específica baseado no erro
                redirectToStepWithError(firstError);
              }}
            ]
          );
        } else {
          Alert.alert(
            'Erro ao Salvar Anúncio',
            errorData.message || 'Ocorreu um erro ao salvar seu anúncio. Por favor, tente novamente mais tarde.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente mais tarde.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!advertiseData.id_anuncio;

  const redirectToStepWithError = (fieldName: string) => {
    // Mapear campos para suas respectivas etapas
    const step1Fields = ['placa', 'marca_veiculo', 'modelo_veiculo', 'ano_fabricacao', 'ano_modelo', 'quilometragem', 'id_cor', 'id_tipo_cambio', 'id_tipo_combustivel', 'num_portas'];
    const step2Fields = ['opcionais'];
    const step3Fields = ['unico_dono', 'ipva_pago', 'veiculo_nome_anunciante', 'financiado', 'parcelas_em_dia', 'todas_revisoes_concessionaria', 'possui_manual', 'possui_chave_reserva', 'possui_ar', 'ar_funcionando', 'escapamento_solta_fumaca', 'garantia_fabrica', 'motor_bate', 'cambio_faz_barulho', 'cambio_escapa_marcha', 'furtado_roubado', 'id_tipo_pneu', 'id_tipo_parabrisa', 'luz_injecao', 'luz_airbag', 'luz_abs', 'tipo_monta', 'passou_leilao'];
    const step4Fields = ['imagens'];
    const step5Fields = ['descricao', 'valor', 'aceite_termos'];

    if (step1Fields.includes(fieldName)) {
      navigation.navigate('advertiseStep1' as any);
    } else if (step2Fields.includes(fieldName)) {
      navigation.navigate('advertiseStep2' as any);
    } else if (step3Fields.includes(fieldName)) {
      navigation.navigate('advertiseStep3' as any);
    } else if (step4Fields.includes(fieldName)) {
      navigation.navigate('advertiseStep4' as any);
    } else if (step5Fields.includes(fieldName)) {
      navigation.navigate('advertiseStep5' as any);
    }
  };

  const renderPlanSelection = () => (
    <>
      <Text fontStyle="p-16-bold" color="black" style={{marginBottom: 10}}>
        Selecione o seu plano
      </Text>
      
      <Text fontStyle="p-14-regular" color="black" style={{marginBottom: 30}}>
        Escolha o plano que mais se adequa às suas necessidades.
      </Text>

      {/* Plano Oficial */}
      <TouchableOpacity
        onPress={() => setSelectedPlan('oficial')}
        style={{
          backgroundColor: '#F8F8F8',
          borderWidth: 1,
          borderColor: '#E11138',
          borderRadius: 8,
          padding: 20,
          marginBottom: 20,
          opacity: selectedPlan === 'oficial' ? 1 : 0.7,
        }}
      >
        <Text fontStyle="p-16-bold" color="brand-red" style={{textAlign: 'center', marginBottom: 10}}>
          Oficial
        </Text>
        
        <Text fontStyle="p-14-bold" color="black" style={{textAlign: 'center', marginBottom: 10}}>
          Anúncio com pagamento mensal!
        </Text>
        
        <Text fontStyle="p-14-regular" color="black" style={{textAlign: 'center', marginBottom: 20}}>
          Pagamento mensal que dá direito a acesso e negociações ilimitadas durante 30 dias.
        </Text>
        
        <Text fontStyle="p-18-bold" color="black-900" style={{textAlign: 'center', marginBottom: 20}}>
          R$ 29,90
        </Text>
        
        <TouchableOpacity
          onPress={() => setSelectedPlan('oficial')}
          style={{
            backgroundColor: '#E11138',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 6,
            alignSelf: 'center',
            width: '100%',
          }}
        >
          <Text fontStyle="p-14-bold" color="white" style={{textAlign: 'center'}}>
            Selecionar
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Plano Grátis */}
      <TouchableOpacity
        onPress={() => setSelectedPlan('gratis')}
        style={{
          backgroundColor: '#F8F8F8',
          borderWidth: 1,
          borderColor: '#E11138',
          borderRadius: 8,
          padding: 20,
          marginBottom: 30,
          opacity: selectedPlan === 'gratis' ? 1 : 0.7,
        }}
      >
        <Text fontStyle="p-16-bold" color="brand-red" style={{textAlign: 'center', marginBottom: 10}}>
          Grátis
        </Text>
        
        <Text fontStyle="p-14-bold" color="black" style={{textAlign: 'center', marginBottom: 20}}>
          Anuncie gratuitamente por tempo limitado.
        </Text>
        
        <Text fontStyle="p-18-bold" color="black-900" style={{textAlign: 'center', marginBottom: 20}}>
          R$ 00,00
        </Text>
        
        <TouchableOpacity
          onPress={() => setSelectedPlan('gratis')}
          style={{
            backgroundColor: '#E11138',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 6,
            alignSelf: 'center',
            width: '100%',
          }}
        >
          <Text fontStyle="p-14-bold" color="white" style={{textAlign: 'center'}}>
            Selecionar
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );

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
            label={isSubmitting ? "Salvando..." : (isEditing ? "Atualizar Anúncio" : "Salvar Anúncio")}
            onPress={handleSaveAd}
            backgroundColor='#9A0B26'
            color='white'
            disabled={isSubmitting || !canProceed}
          />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <ProgressSteps currentStep={6} />
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          {needsPlanSelection ? (
            renderPlanSelection()
          ) : (
            <>
              <Text fontStyle="p-16-bold" color="gray-500" style={{marginBottom: 30}}>
                Finalize seu anúncio
              </Text>

              <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
                Atenção!
              </Text>

              <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
                O Repasse Rápido é uma plataforma voltada exclusivamente para operações realizadas por pessoas jurídicas (lojas e repassadores). Por isso, 
                <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18 }}> seu anúncio não será publicado diretamente.</Text>
              </Text>

              <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
                Em breve, um intermediador independente próximo à sua região entrará em contato  
                <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18 }}>
                 {" para explicar como funciona o processo de repasse. Esse profissional incluirá no valor do seu veículo uma comissão, utilizando sua rede de contatos para realizar a venda."}
                </Text>
              </Text>
              
              <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
              Para seguir com a operação, será necessária a vistoria cautelar do veículo. Sem ela, o processo de venda não será iniciado.
              </Text>

              <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
                ⚠️ Importante:
              </Text>

              <View style={{ marginBottom: 20 }}>
                <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 10 }}>
                  • Não realize pagamentos 
                  <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18 }}>{" ao intermediador."}</Text>
                </Text>
                <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 10 }}>
                  • O valor da comissão será repassado ao intermediador pelo comprador,
                  <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18 }}>{" dentro do valor final do veículo."}</Text>
                </Text>
                <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 10 }}>
                  • Nunca entregue o veículo
                  <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18 }}>{" antes de receber o pagamento acordado em sua conta bancária."}</Text>
                </Text>
                <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
                  • A entrega do veículo só deve ser feita mediante o 
                  <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18 }}>{" preenchimento da ATPV (recibo de venda) "}</Text>
                  no nome da pessoa que realizou o pagamento.
                </Text>
              </View>

              <Text color="black" fontStyle="p-14-regular" style={{ textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
                O
                <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18 }}>{" Repasse Rápido "}</Text>
                é uma plataforma de anúncios e 
                <Text color="black" fontStyle="p-14-bold" style={{ textAlign: 'left', lineHeight: 18 }}>{" não se responsabiliza por ações dos intermediadores ou compradores. "}</Text>
                No entanto, todos os usuários estão devidamente cadastrados, e essas informações podem ser fornecidas judicialmente, se necessário.
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setAgreeTerms(!agreeTerms)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#E11138',
                    backgroundColor: agreeTerms ? '#E11138' : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  {agreeTerms && (
                    <Text color="white" fontStyle="c-12-bold">✓</Text>
                  )}
                </TouchableOpacity>
                <Text color="black" fontStyle="p-14-regular" style={{ flex: 1, lineHeight: 20 }}>
                  Li e concordo com os termos acima.
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </PageScaffold>
  );
};

export default Step6;
