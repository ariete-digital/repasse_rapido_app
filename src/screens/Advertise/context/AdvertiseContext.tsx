import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ImageData } from '../types';
import { api } from '@lib/api';

interface AdvertiseData {
  // ID do anúncio (para edição)
  id?: number | null;
  
  // Flag para publicar automaticamente após edição
  shouldPublish?: boolean;
  
  // Step 1 - Dados do Veículo
  tipo_veiculo?: string;
  marca_veiculo?: string;
  modelo_veiculo?: string;
  submodelo?: string;
  placa?: string;
  ano_fabricacao?: string;
  ano_modelo?: string;
  id_cor?: string;
  id_tipo_cambio?: string;
  id_tipo_combustivel?: string;
  num_portas?: string;
  quilometragem?: string;

  // Step 2 - Opcionais
  opcionais?: number[];

  // Step 3 - Dados do Veículo (detalhes)
  status_veiculo?: string;
  unico_dono?: string;
  ipva_pago?: string;
  veiculo_nome_anunciante?: string;
  financiado?: string;
  parcelas_em_dia?: string;
  todas_revisoes_concessionaria?: string;
  possui_manual?: string;
  possui_chave_reserva?: string;
  possui_ar?: string;
  ar_funcionando?: string;
  escapamento_solta_fumaca?: string;
  garantia_fabrica?: string;
  motor_bate?: string;
  cambio_faz_barulho?: string;
  cambio_escapa_marcha?: string;
  furtado_roubado?: string;
  id_tipo_pneu?: string;
  id_tipo_parabrisa?: string;
  luz_injecao?: string;
  luz_airbag?: string;
  luz_abs?: string;
  tipo_monta?: string;
  passou_leilao?: string;

  // Step 4 - Imagens
  imagens?: ImageData[];
  imagensOriginais?: ImageData[]; // Armazenar imagens originais ao carregar para edição

  // Step 5 - Valor e Descrição
  descricao?: string;
  valor?: string;
  valor_fipe?: string;
  aceite_termos?: string;
}

interface ParametroItem {
  id: number;
  descricao: string;
  tipo_veiculo?: string;
}

interface AdvertiseParameters {
  cores: ParametroItem[];
  tiposCambio: ParametroItem[];
  tiposCombustivel: ParametroItem[];
  tiposParabrisa: ParametroItem[];
  tiposPneu: ParametroItem[];
  opcionais: ParametroItem[];
}

interface AdvertiseContextData {
  advertiseData: AdvertiseData;
  parameters: AdvertiseParameters;
  isLoadingParameters: boolean;
  updateStep1Data: (data: Partial<AdvertiseData>) => void;
  updateStep2Data: (data: Partial<AdvertiseData>) => void;
  updateStep3Data: (data: Partial<AdvertiseData>) => void;
  updateStep4Data: (data: Partial<AdvertiseData>) => void;
  updateStep5Data: (data: Partial<AdvertiseData>) => void;
  clearAdvertiseData: () => void;
  clearEditCache: () => void;
  loadAdDataForEdit: (codigo: string) => Promise<void>;
  isEditing: boolean; // Helper para verificar se está em modo edição
}

const AdvertiseContext = createContext<AdvertiseContextData>({} as AdvertiseContextData);

interface AdvertiseProviderProps {
  children: ReactNode;
}

export const AdvertiseProvider: React.FC<AdvertiseProviderProps> = ({ children }) => {
  const [advertiseData, setAdvertiseData] = useState<AdvertiseData>({});
  const [parameters, setParameters] = useState<AdvertiseParameters>({
    cores: [],
    tiposCambio: [],
    tiposCombustivel: [],
    tiposParabrisa: [],
    tiposPneu: [],
    opcionais: [],
  });
  const [isLoadingParameters, setIsLoadingParameters] = useState(true);

  // Carregar parâmetros ao montar o contexto
  useEffect(() => {
    const loadParameters = async () => {
      try {
        const response = await api.get('/cliente/meus_anuncios/obter_info_parametros');
        
        if (response.data.status === 'success' && response.data.content) {
          const content = response.data.content;
          setParameters({
            cores: content.cores || [],
            tiposCambio: content.tiposCambio || [],
            tiposCombustivel: content.tiposCombustivel || [],
            tiposParabrisa: content.tiposParabrisa || [],
            tiposPneu: content.tiposPneu || [],
            opcionais: content.opcionais || [],
          });
        }
      } catch (error) {
      } finally {
        setIsLoadingParameters(false);
      }
    };

    loadParameters();
  }, []);

  // Função auxiliar para preservar campos críticos ao atualizar
  const preserveCriticalFields = (prev: AdvertiseData, data: Partial<AdvertiseData>): AdvertiseData => {
    // Campos críticos que NUNCA devem ser perdidos durante atualizações
    // Estes campos identificam que é uma edição e não uma criação
    const criticalFields: Partial<AdvertiseData> = {};
    
    // Preservar id se existir (nunca perder durante updates)
    // Este é o campo mais crítico - sem ele, a API cria um novo anúncio ao invés de atualizar
    if (prev.id !== undefined && prev.id !== null) {
      criticalFields.id = prev.id;
    }
    
    // Preservar imagensOriginais se existir (para comparação de imagens removidas)
    // Importante para detectar quais imagens foram removidas durante edição
    // Preservar mesmo se estiver vazio (undefined vs array vazio é diferente)
    if (prev.imagensOriginais !== undefined) {
      criticalFields.imagensOriginais = prev.imagensOriginais;
    }
    
    // Preservar shouldPublish se existir (flag para publicar após edição)
    if (prev.shouldPublish !== undefined) {
      criticalFields.shouldPublish = prev.shouldPublish;
    }
    
    // IMPORTANTE: Remover explicitamente campos críticos do data se alguém tentar sobrescrevê-los
    // Isso garante que mesmo que alguém passe id: undefined, ele será preservado
    const { id: _, imagensOriginais: __, shouldPublish: ___, ...safeData } = data;
    
    // Fazer merge: primeiro prev, depois safeData (sem campos críticos), depois criticalFields (garante preservação)
    // A ordem é crítica: criticalFields por último garante que os campos críticos sempre prevalecem
    return { ...prev, ...safeData, ...criticalFields };
  };

  const updateStep1Data = (data: Partial<AdvertiseData>) => {
    setAdvertiseData(prev => preserveCriticalFields(prev, data));
  };

  const updateStep2Data = (data: Partial<AdvertiseData>) => {
    setAdvertiseData(prev => preserveCriticalFields(prev, data));
  };

  const updateStep3Data = (data: Partial<AdvertiseData>) => {
    setAdvertiseData(prev => preserveCriticalFields(prev, data));
  };

  const updateStep4Data = (data: Partial<AdvertiseData>) => {
    setAdvertiseData(prev => preserveCriticalFields(prev, data));
  };

  const updateStep5Data = (data: Partial<AdvertiseData>) => {
    setAdvertiseData(prev => preserveCriticalFields(prev, data));
  };

  const clearAdvertiseData = () => {
    setAdvertiseData({});
  };

  const clearEditCache = () => {
    // Limpar apenas dados de edição, mas preservar se for necessário manter alguma referência
    // Esta função é chamada antes de carregar novos dados para edição, então está OK limpar tudo
    setAdvertiseData(prev => {
      const { id, imagensOriginais, ...rest } = prev;
      return rest;
    });
  };

  const loadAdDataForEdit = async (codigo: string) => {
    try {
      const response = await api.get(`/cliente/meus_anuncios/detalhes?codigo=${codigo}`);
      
      if (response.data.status === 'success' && response.data.content.anuncio) {
        const ad = response.data.content.anuncio;
        const imagensResponse = response.data.content.imagens || [];
        
        
        // Converter campos numéricos para string (para compatibilidade com os forms)
        const convertToString = (value: any) => value != null ? value.toString() : '';
        const convertBoolToString = (value: any) => value === 1 || value === true ? '1' : '0';
        
        // Preencher todos os dados do anúncio
        setAdvertiseData({
          id: ad.id,
          
          // Step 1
          placa: ad.placa || '',
          marca_veiculo: ad.marca_veiculo || '',
          modelo_veiculo: ad.modelo_veiculo || '',
          submodelo: ad.submodelo || '',
          ano_fabricacao: convertToString(ad.ano_fabricacao),
          ano_modelo: convertToString(ad.ano_modelo),
          quilometragem: convertToString(ad.quilometragem),
          id_cor: convertToString(ad.id_cor),
          id_tipo_cambio: convertToString(ad.id_tipo_cambio),
          id_tipo_combustivel: convertToString(ad.id_tipo_combustivel),
          num_portas: convertToString(ad.num_portas),
          
          // Step 2 - Opcionais (converter array de objetos para array de IDs)
          opcionais: ad.opcionais ? ad.opcionais.map((opt: any) => opt.id) : [],
          
          // Step 3
          status_veiculo: ad.status_veiculo || '',
          unico_dono: convertBoolToString(ad.unico_dono),
          ipva_pago: convertBoolToString(ad.ipva_pago),
          veiculo_nome_anunciante: convertBoolToString(ad.veiculo_nome_anunciante),
          financiado: convertBoolToString(ad.financiado),
          parcelas_em_dia: convertBoolToString(ad.parcelas_em_dia),
          todas_revisoes_concessionaria: convertBoolToString(ad.todas_revisoes_concessionaria),
          possui_manual: convertBoolToString(ad.possui_manual),
          possui_chave_reserva: convertBoolToString(ad.possui_chave_reserva),
          possui_ar: convertBoolToString(ad.possui_ar),
          ar_funcionando: convertBoolToString(ad.ar_funcionando),
          escapamento_solta_fumaca: convertBoolToString(ad.escapamento_solta_fumaca),
          garantia_fabrica: convertBoolToString(ad.garantia_fabrica),
          motor_bate: convertBoolToString(ad.motor_bate),
          cambio_faz_barulho: convertBoolToString(ad.cambio_faz_barulho),
          cambio_escapa_marcha: convertBoolToString(ad.cambio_escapa_marcha),
          furtado_roubado: convertBoolToString(ad.furtado_roubado),
          id_tipo_pneu: convertToString(ad.id_tipo_pneu),
          id_tipo_parabrisa: convertToString(ad.id_tipo_parabrisa),
          luz_injecao: convertBoolToString(ad.luz_injecao),
          luz_airbag: convertBoolToString(ad.luz_airbag),
          luz_abs: convertBoolToString(ad.luz_abs),
          tipo_monta: ad.tipo_monta || '',
          passou_leilao: convertBoolToString(ad.passou_leilao),
          
          // Step 4 - Imagens (processar array separado de imagens da resposta)
          imagens: (() => {
            // Processar imagens vindas do array content.imagens
            if (imagensResponse && Array.isArray(imagensResponse) && imagensResponse.length > 0) {
              const processedImages = imagensResponse.map((img: any, index: number) => {
                // Usar str_base64 como URI (URL da imagem)
                const imageUri = img.str_base64 || img.arquivo || '';
                return {
                  uri: imageUri,
                  base64: '', // Não temos base64, apenas URL
                  name: img.arquivo || `image_${index}.jpg`,
                  type: 'image/jpeg',
                  principal: img.principal === true || img.principal === 1,
                  index: index,
                  id: img.id // Armazenar ID da imagem original
                };
              });
              // Armazenar também como imagens originais para comparação posterior
              return processedImages;
            }
            
            // Fallback: se não há imagens no array separado, verificar se há no anúncio
            if (ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
              const processedImages = ad.imagens.map((img: any, index: number) => {
                if (typeof img === 'string') {
                  return {
                    uri: img,
                    base64: '',
                    name: `image_${index}.jpg`,
                    type: 'image/jpeg',
                    principal: index === 0,
                    index: index
                  };
                }
                return {
                  uri: img.link || img.arquivo || img.str_base64 || '',
                  base64: '',
                  name: img.arquivo || `image_${index}.jpg`,
                  type: 'image/jpeg',
                  principal: img.principal === true || img.principal === 1,
                  index: index,
                  id: img.id // Armazenar ID se disponível
                };
              });
              return processedImages;
            }
            
            return [];
          })(),
          // Armazenar cópia das imagens originais para comparação ao salvar
          imagensOriginais: (() => {
            if (imagensResponse && Array.isArray(imagensResponse) && imagensResponse.length > 0) {
              return imagensResponse.map((img: any, index: number) => {
                const imageUri = img.str_base64 || img.arquivo || '';
                return {
                  uri: imageUri,
                  base64: '',
                  name: img.arquivo || `image_${index}.jpg`,
                  type: 'image/jpeg',
                  principal: img.principal === true || img.principal === 1,
                  index: index,
                  id: img.id
                };
              });
            }
            return [];
          })(),
          
          // Step 5
          descricao: ad.descricao || '',
          valor: ad.valor || '',
          valor_fipe: ad.valor_fipe || '',
          aceite_termos: convertBoolToString(ad.aceite_termos),
        });
        
      }
    } catch (error) {
      throw error;
    }
  };

  // Helper para verificar se está em modo edição
  const isEditing = !!advertiseData.id;

  return (
    <AdvertiseContext.Provider
      value={{
        advertiseData,
        parameters,
        isLoadingParameters,
        updateStep1Data,
        updateStep2Data,
        updateStep3Data,
        updateStep4Data,
        updateStep5Data,
        clearAdvertiseData,
        clearEditCache,
        loadAdDataForEdit,
        isEditing,
      }}
    >
      {children}
    </AdvertiseContext.Provider>
  );
};

export const useAdvertise = () => {
  const context = useContext(AdvertiseContext);
  if (!context) {
    throw new Error('useAdvertise must be used within an AdvertiseProvider');
  }
  return context;
};

