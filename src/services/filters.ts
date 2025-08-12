import { api } from '@lib/api';
import { Offer } from '@screens/Details/types';

export const getBrands = async (keyword: string) => {
  const {
    data: { content },
  } = await api.get(`/cliente/listagem/marcas?filtro=${keyword}`);

  return content;
};
export const getModels = async (keyword: string) => {
  const {
    data: { content },
  } = await api.get(`/cliente/listagem/modelos?filtro=${keyword}`);

  return content;
};

export const getColors = async () => {
  const {
    data: { content },
  } = await api.get('cliente/listagem/cores');
  return content;
};

export const getState = async (keyword: string) => {
  const {
    data: { content },
  } = await api.get(`/cliente/listagem/estados?filtro=${keyword}`);

  return content;
};

export const getCity = async (keyword: string) => {
  const {
    data: { content },
  } = await api.get(`cliente/listagem/cidades?filtro=${keyword}
  `);

  return content;
};

export const getFilteredData = async (
  properties: FilterOptions
): Promise<FilteredApiResponse> => {
  // console.log('properties =', properties);
  const {
    data: { content },
  } = await api.post('/cliente/anuncios/filtrar', properties);
  return content as FilteredApiResponse;
};

export interface RootObject {
  tipo_veiculo?: string;
  tipo_venda?: string;
  id_cidade?: number;
  id_marca?: number;
  id_modelo?: number;
  versao_veiculo?: string;
  status_veiculo?: string;
  ano?: {
    min?: number;
    max?: number;
  };
  valor?: {
    min?: number;
    max?: number;
  };
  quilometragem?: {
    min?: number;
    max?: number;
  };
  tipos_vendedor?: string[];
  tipos_cambio?: number[];
  tipos_combustivel?: number[];
  num_portas?: number[];
  cor?: number;
  opcionais?: number[];
}

export interface FilterOptions {
  ordenacao?: string;
  aceite_termos?: number;
  cores?: string[];
  tipo_veiculo?: 'C' | 'M';
  tipo_venda?: 'C' | 'R';
  marca?: string;
  id_cidade?: number;
  id_estado?: number;
  id_marca?: number;
  id_loja?: number;
  modelo?: string;
  versao_veiculo?: string;
  status_veiculo: 'U' | 'N';
  ano?: {
    min?: number;
    max?: number;
  };
  valor?: {
    min?: number;
    max?: number;
  };
  quilometragem?: {
    min?: number;
    max?: number;
  };
  tipos_vendedor?: string[];
  tipos_cambio?: number[];
  tipos_combustivel?: number[];
  num_portas?: number[];
  cor?: number;
  opcionais?: number[];
}

export interface FilteredApiResponse {
  anuncios: Offer[];
  listaOpcionais: GenericItem[];
  listaTiposCambio: GenericItem[];
  listaTiposCombustivel: GenericItem[];
}

export type GenericItem = {
  id: number;
  descricao: string;
};
