import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ImageData } from '../types';
import { api } from '@lib/api';

interface AdvertiseData {
  // ID do anúncio (para edição)
  id_anuncio?: number | null;
  
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

  // Step 5 - Valor e Descrição
  descricao?: string;
  valor?: string;
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
  loadAdDataForEdit: (codigo: string) => Promise<void>;
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
        console.error('Erro ao carregar parâmetros:', error);
      } finally {
        setIsLoadingParameters(false);
      }
    };

    loadParameters();
  }, []);

  const updateStep1Data = (data: Partial<AdvertiseData>) => {
    console.log('Updating Step1 data:', data);
    setAdvertiseData(prev => ({ ...prev, ...data }));
  };

  const updateStep2Data = (data: Partial<AdvertiseData>) => {
    console.log('Updating Step2 data:', data);
    setAdvertiseData(prev => ({ ...prev, ...data }));
  };

  const updateStep3Data = (data: Partial<AdvertiseData>) => {
    console.log('Updating Step3 data:', data);
    setAdvertiseData(prev => ({ ...prev, ...data }));
  };

  const updateStep4Data = (data: Partial<AdvertiseData>) => {
    console.log('Updating Step4 data:', data);
    setAdvertiseData(prev => ({ ...prev, ...data }));
  };

  const updateStep5Data = (data: Partial<AdvertiseData>) => {
    console.log('Updating Step5 data:', data);
    setAdvertiseData(prev => ({ ...prev, ...data }));
  };

  const clearAdvertiseData = () => {
    console.log('Clearing advertise data');
    setAdvertiseData({});
  };

  const loadAdDataForEdit = async (codigo: string) => {
    try {
      console.log('Loading ad data for edit, codigo:', codigo);
      const response = await api.get(`/cliente/anuncios/detalhe?codigo=${codigo}`);
      
      if (response.data.status === 'success' && response.data.content.anuncio) {
        const ad = response.data.content.anuncio;
        
        // Converter campos numéricos para string (para compatibilidade com os forms)
        const convertToString = (value: any) => value != null ? value.toString() : '';
        const convertBoolToString = (value: any) => value === 1 || value === true ? '1' : '0';
        
        // Preencher todos os dados do anúncio
        setAdvertiseData({
          id_anuncio: ad.id,
          
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
          
          // Step 4 - Imagens (converter para formato esperado)
          imagens: ad.imagens ? ad.imagens.map((img: any, index: number) => ({
            uri: img.link || img.arquivo || '',
            name: `image_${index}.jpg`,
            type: 'image/jpeg',
            principal: img.principal === 1,
            index: index
          })) : [],
          
          // Step 5
          descricao: ad.descricao || '',
          valor: ad.valor || '',
          aceite_termos: convertBoolToString(ad.aceite_termos),
        });
        
        console.log('Ad data loaded for edit successfully');
      }
    } catch (error) {
      console.error('Error loading ad data for edit:', error);
      throw error;
    }
  };

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
        loadAdDataForEdit,
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

