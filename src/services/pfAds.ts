import { api } from '@lib/api';

export interface PFAd {
  id: number;
  tipo_plano: string;
  tipo_plano_str: string;
  tipo_venda: string;
  tipo_venda_str: string;
  tipo_vendedor: string;
  tipo_vendedor_str: string;
  tipo_veiculo: string;
  tipo_veiculo_str: string;
  marca_veiculo: string;
  modelo_veiculo: string;
  submodelo: string;
  valor_fipe: string | null;
  renavam: string | null;
  placa: string;
  status_veiculo: string;
  ano_fabricacao: string;
  ano_modelo: string;
  quilometragem: number;
  num_portas: string;
  valor: string | null;
  descricao: string | null;
  codigo: string;
  created_at: string;
  ativo: boolean;
  pausado: boolean;
  cliente: {
    id: number;
    nome: string;
    telefone: string;
    celular: string | null;
    cidade: {
      id: number;
      nome: string;
    };
  };
  cidadeAnunciante: string;
  cor: {
    id: number;
    descricao: string;
  };
  tipo_cambio: {
    id: number;
    descricao: string;
  };
  tipo_combustivel: {
    id: number;
    descricao: string;
  };
  opcionais: Array<{
    id: number;
    descricao: string;
  }>;
  imagemPrincipal?: string;
  imagens?: string[];
}

export interface PFAdsResponse {
  status: string;
  content: {
    anuncios: PFAd[];
  };
}

export interface PublishAdRequest {
  id_anuncio: number;
}

export interface PublishAdResponse {
  status: string;
  message?: string;
}

export const getPFAds = async (): Promise<PFAdsResponse> => {
  const response = await api.get('/cliente/anuncios/lista_anuncios_vincular');
  return response.data;
};

export const publishAd = async (idAnuncio: number): Promise<PublishAdResponse> => {
  const response = await api.post('/cliente/anuncios/publicar_anuncio', {
    id_anuncio: idAnuncio
  });
  return response.data;
};
