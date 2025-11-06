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
  const { advertiseData, clearAdvertiseData, clearEditCache, isEditing: isEditingFromContext } = useAdvertise();
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

  // Função auxiliar para converter string '1'/'0' para number (1 ou 0)
  const stringToNumber = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  };

  // Função auxiliar para converter string para boolean (1 ou 0)
  const stringToFormBoolean = (value: string | undefined): number => {
    return (value === '1' || value === 'true') ? 1 : 0;
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
      // Verificar se está editando antes de preparar os dados
      const isEditing = isEditingFromContext || !!advertiseData.id;
      
      // Preparar FormData para multipart/form-data
      const formData = new FormData();

      // CRÍTICO: Sempre enviar o ID quando existir, caso contrário a API criará um novo anúncio
      // Este é o campo que diferencia criação de edição na API
      // IMPORTANTE: O id deve estar sempre preservado no contexto, mesmo ao navegar entre steps
      if (advertiseData.id !== undefined && advertiseData.id !== null) {
        formData.append('id', advertiseData.id.toString());
      } else if (isEditing) {
        // Se deveria estar editando mas não tem ID, há um problema crítico
        // Isso não deveria acontecer se preserveCriticalFields estiver funcionando corretamente
        Alert.alert(
          'Erro Crítico',
          'ID do anúncio não encontrado. O anúncio não pode ser atualizado.\n\nPor favor, retorne à tela inicial e inicie a edição novamente.',
          [
            { 
              text: 'OK',
              onPress: () => {
                // Limpar dados e voltar para a tela inicial
                clearEditCache();
                navigation.navigate('advertiseHome' as any);
              }
            }
          ]
        );
        setIsSubmitting(false);
        return;
      }

      formData.append('tipo_veiculo', 'C'); // C = Carro

      // Status do veículo (N = Novo, U = Usado)
      if (advertiseData.status_veiculo) {
        formData.append('status_veiculo', advertiseData.status_veiculo);
      }

      // Step 1 - Dados do Veículo
      if (advertiseData.placa) {
        formData.append('placa', advertiseData.placa.replace(/-/g, '')); // Placa sem hífen
      }
      if (advertiseData.marca_veiculo) formData.append('marca_veiculo', advertiseData.marca_veiculo);
      if (advertiseData.modelo_veiculo) formData.append('modelo_veiculo', advertiseData.modelo_veiculo);
      if (advertiseData.submodelo) formData.append('submodelo', advertiseData.submodelo);
      
      // Converter strings para numbers
      if (advertiseData.ano_fabricacao) formData.append('ano_fabricacao', stringToNumber(advertiseData.ano_fabricacao)!.toString());
      if (advertiseData.ano_modelo) formData.append('ano_modelo', stringToNumber(advertiseData.ano_modelo)!.toString());
      if (advertiseData.quilometragem) formData.append('quilometragem', stringToNumber(advertiseData.quilometragem)!.toString());
      if (advertiseData.id_cor) formData.append('id_cor', stringToNumber(advertiseData.id_cor)!.toString());
      if (advertiseData.id_tipo_cambio) formData.append('id_tipo_cambio', stringToNumber(advertiseData.id_tipo_cambio)!.toString());
      if (advertiseData.id_tipo_combustivel) formData.append('id_tipo_combustivel', stringToNumber(advertiseData.id_tipo_combustivel)!.toString());
      if (advertiseData.num_portas) formData.append('num_portas', stringToNumber(advertiseData.num_portas)!.toString());

      // Step 2 - Opcionais (adicionar como array)
      if (advertiseData.opcionais && advertiseData.opcionais.length > 0) {
        advertiseData.opcionais.forEach(opcional => {
          formData.append('opcionais[]', opcional.toString());
        });
      }

      // Step 3 - Dados Detalhados do Veículo (converter para 1 ou 0)
      formData.append('unico_dono', stringToFormBoolean(advertiseData.unico_dono).toString());
      formData.append('ipva_pago', stringToFormBoolean(advertiseData.ipva_pago).toString());
      formData.append('veiculo_nome_anunciante', stringToFormBoolean(advertiseData.veiculo_nome_anunciante).toString());
      formData.append('financiado', stringToFormBoolean(advertiseData.financiado).toString());
      formData.append('parcelas_em_dia', stringToFormBoolean(advertiseData.parcelas_em_dia).toString());
      formData.append('todas_revisoes_concessionaria', stringToFormBoolean(advertiseData.todas_revisoes_concessionaria).toString());
      formData.append('possui_manual', stringToFormBoolean(advertiseData.possui_manual).toString());
      formData.append('possui_chave_reserva', stringToFormBoolean(advertiseData.possui_chave_reserva).toString());
      formData.append('possui_ar', stringToFormBoolean(advertiseData.possui_ar).toString());
      formData.append('ar_funcionando', stringToFormBoolean(advertiseData.ar_funcionando).toString());
      formData.append('escapamento_solta_fumaca', stringToFormBoolean(advertiseData.escapamento_solta_fumaca).toString());
      formData.append('garantia_fabrica', stringToFormBoolean(advertiseData.garantia_fabrica).toString());
      formData.append('motor_bate', stringToFormBoolean(advertiseData.motor_bate).toString());
      formData.append('cambio_faz_barulho', stringToFormBoolean(advertiseData.cambio_faz_barulho).toString());
      formData.append('cambio_escapa_marcha', stringToFormBoolean(advertiseData.cambio_escapa_marcha).toString());
      formData.append('furtado_roubado', stringToFormBoolean(advertiseData.furtado_roubado).toString());
      formData.append('passou_leilao', stringToFormBoolean(advertiseData.passou_leilao).toString());
      
      // Campos numéricos do Step 3
      if (advertiseData.id_tipo_pneu) formData.append('id_tipo_pneu', stringToNumber(advertiseData.id_tipo_pneu)!.toString());
      if (advertiseData.id_tipo_parabrisa) formData.append('id_tipo_parabrisa', stringToNumber(advertiseData.id_tipo_parabrisa)!.toString());
      
      // Tipo de monta - manter campo original
      if (advertiseData.tipo_monta) {
        formData.append('tipo_monta', advertiseData.tipo_monta);
      }

      // Luzes - manter campos separados
      formData.append('luz_injecao', stringToFormBoolean(advertiseData.luz_injecao).toString());
      formData.append('luz_airbag', stringToFormBoolean(advertiseData.luz_airbag).toString());
      formData.append('luz_abs', stringToFormBoolean(advertiseData.luz_abs).toString());

      // Step 4 - Imagens
      if (isEditing && advertiseData.imagensOriginais && advertiseData.imagensOriginais.length > 0) {
        // Modo edição: detectar imagens removidas e novas
        
        // IDs das imagens originais
        const originalImageIds = advertiseData.imagensOriginais
          .map(img => img.id)
          .filter((id): id is number => id !== undefined);
        
        // Obter IDs das imagens atuais que são mantidas (têm ID e não foram substituídas)
        const currentMaintainedIds = (advertiseData.imagens || [])
          .filter(img => {
            // Imagem mantida se tem ID E não tem base64 novo (não foi substituída)
            return img.id !== undefined && (!img.base64 || img.base64.length === 0);
          })
          .map(img => img.id)
          .filter((id): id is number => id !== undefined);
        
        // Identificar IDs removidos (estavam nas originais mas não estão mais nas mantidas)
        const removedIds = originalImageIds.filter(id => !currentMaintainedIds.includes(id));
        
        // Enviar IDs removidos se houver
        if (removedIds.length > 0) {
          formData.append('idsRemovidos', removedIds.join(','));
        }
        
        // Enviar apenas novas imagens:
        // - Imagens sem ID (totalmente novas)
        // - Imagens com base64 (substituídas, mesmo que originalmente tinham ID)
        const newImages = (advertiseData.imagens || []).filter(img => {
          // Nova imagem se não tem ID (totalmente nova) OU tem base64 (foi selecionada/substituída)
          const isNewImage = !img.id || (img.base64 && img.base64.length > 0);
          
          // Não enviar imagens mantidas (têm ID, não têm base64, e URI é URL remota)
          if (img.id && (!img.base64 || img.base64.length === 0) && img.uri && !img.uri.startsWith('file://') && !img.uri.startsWith('content://')) {
            return false;
          }
          
          // Enviar apenas se for nova imagem e tiver URI válida
          return isNewImage && img.uri && (img.uri.startsWith('file://') || img.uri.startsWith('content://') || (img.base64 && img.base64.length > 0));
        });
        
        newImages.forEach((img) => {
          formData.append('imagens[]', {
            uri: img.uri,
            type: 'image/jpeg',
            name: img.name || `image_${Date.now()}.jpg`,
          } as any);
        });
      } else {
        // Modo criação: enviar todas as imagens
        if (advertiseData.imagens && advertiseData.imagens.length > 0) {
          advertiseData.imagens.forEach((img, index) => {
            if (img.uri) {
              formData.append('imagens[]', {
                uri: img.uri,
                type: 'image/jpeg',
                name: img.name || `image_${index}.jpg`,
              } as any);
            }
          });
        }
      }

      // Step 5 - Valor e Descrição
      if (advertiseData.descricao) formData.append('descricao', advertiseData.descricao);
      
      // Valor
      if (advertiseData.valor) {
        formData.append('valor', parseFloat(advertiseData.valor).toString());
      }
      
      // Valor FIPE (se disponível)
      if (advertiseData.valor_fipe) {
        formData.append('valor_fipe', advertiseData.valor_fipe);
      }
      
      // Aceite termos
      formData.append('aceite_termos', stringToFormBoolean(advertiseData.aceite_termos) ? 'true' : 'false');

      // Tipo de plano baseado na seleção do usuário
      if (needsPlanSelection && selectedPlan) {
        formData.append('tipo_plano', selectedPlan === 'oficial' ? 'O' : 'G');
      } else {
        // Para usuários PF, usar plano padrão
        formData.append('tipo_plano', 'G');
      }

      // Log de debug

      // Enviar para a API com Content-Type: multipart/form-data
      const response = await api.post('/cliente/meus_anuncios/salvar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 segundos de timeout
      });


      if (response.data.status === 'success') {
        // A API retorna id (não id_anuncio_rascunho)
        const adNumber = response.data.content?.id || response.data.content?.id_anuncio_rascunho || advertiseData.id || 'N/A';
        
        const isEditing = !!advertiseData.id;
        
        // Verificar se deve publicar automaticamente
        if (advertiseData.shouldPublish && isEditing) {
          try {
            const publishResponse = await api.post('/cliente/anuncios/publicar_anuncio', {
              id_anuncio: parseInt(adNumber.toString())
            });
            
            if (publishResponse.data.status === 'success') {
            }
          } catch (publishError) {
            // Não bloquear o fluxo se a publicação falhar
          }
        }
        
        // Limpar dados do contexto
        if (isEditing) {
          // Se estava editando, limpar apenas o cache de edição
          clearEditCache();
        } else {
          // Se estava criando, limpar todos os dados
          clearAdvertiseData();
        }
        
        // Navegar diretamente para tela de sucesso
        navigation.navigate('advertiseSuccess', { 
          adNumber: adNumber.toString(),
          isEditing: isEditing
        });
      } else {
        throw new Error(response.data.message || 'Erro ao salvar anúncio');
      }
    } catch (error: any) {
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

  const isEditing = !!advertiseData.id;

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
            {selectedPlan === 'oficial' ? 'Selecionado' : 'Selecionar'}
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
            {selectedPlan === 'gratis' ? 'Selecionado' : 'Selecionar'}
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
