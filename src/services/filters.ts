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

// Novas rotas para filtros - verificando se existem na API
export const getTiposCambio = async () => {
  try {
    const {
      data: { content },
    } = await api.get('/cliente/listagem/tipos_cambio');
    return content;
  } catch (error) {
    console.warn('Rota tipos_cambio não encontrada:', error);
    return [];
  }
};

export const getTiposCombustivel = async () => {
  try {
    const {
      data: { content },
    } = await api.get('/cliente/listagem/tipos_combustivel');
    return content;
  } catch (error) {
    console.warn('Rota tipos_combustivel não encontrada:', error);
    return [];
  }
};

export const getOpcionais = async () => {
  const {
    data: { content },
  } = await api.get('/cliente/listagem/opcionais');
  return content;
};

// Removidas rotas que não existem na API
// export const getTiposVendedor = async () => {
//   const {
//     data: { content },
//   } = await api.get('/cliente/listagem/tipos_vendedor');
//   return content;
// };

// export const getTiposVenda = async () => {
//   const {
//     data: { content },
//   } = await api.get('/cliente/listagem/tipos_venda');
//   return content;
// };

export const getFilteredData = async (
  properties: FilterOptions
): Promise<FilteredApiResponse> => {
  console.log('getFilteredData - properties:', properties);
  const {
    data: { content },
  } = await api.post('/cliente/anuncios/filtrar', properties);
  console.log('getFilteredData - response:', content);
  return content as FilteredApiResponse;
};

// Nova função para buscar dados de filtros com contagem
export const getFilterDataWithCount = async (
  properties: FilterOptions
): Promise<{
  anuncios: Offer[];
  total: number;
  filterCounts: {
    marcas: { id: number; descricao: string; count: number }[];
    modelos: { id: number; descricao: string; count: number }[];
    cores: { id: number; descricao: string; count: number }[];
    tiposCambio: { id: number; descricao: string; count: number }[];
    tiposCombustivel: { id: number; descricao: string; count: number }[];
    opcionais: { id: number; descricao: string; count: number }[];
  };
}> => {
  console.log('getFilterDataWithCount - properties:', properties);
  
  // Buscar dados filtrados
  const filteredData = await getFilteredData(properties);
  
  // Buscar contagens para cada filtro
  const [marcas, modelos, cores, tiposCambio, tiposCombustivel, opcionais] = await Promise.all([
    getBrands(''),
    getModels(''),
    getColors(),
    getTiposCambio(),
    getTiposCombustivel(),
    getOpcionais(),
  ]);
  
  return {
    anuncios: filteredData.anuncios,
    total: filteredData.total,
    filterCounts: {
      marcas: marcas || [],
      modelos: modelos || [],
      cores: cores || [],
      tiposCambio: tiposCambio || [],
      tiposCombustivel: tiposCombustivel || [],
      opcionais: opcionais || [],
    }
  };
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
  cidade_nome?: string;
  id_marca?: number;
  id_loja?: number;
  modelo?: string;
  versao_veiculo?: string;
  status_veiculo?: 'U' | 'N';
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
  limit?: number;
  page?: number;
}

export interface FilteredApiResponse {
  anuncios: Offer[];
  total: number;
  listaOpcionais: GenericItem[];
  listaTiposCambio: GenericItem[];
  listaTiposCombustivel: GenericItem[];
}

export type GenericItem = {
  id: number;
  descricao: string;
};
