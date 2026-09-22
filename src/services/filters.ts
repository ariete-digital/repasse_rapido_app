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

const asList = (content: any, key: string) => {
  if (Array.isArray(content)) return content;
  if (Array.isArray(content?.[key])) return content[key];
  return [];
};

export const getTiposCambio = async () => {
  try {
    const {
      data: { content },
    } = await api.get('/cliente/listagem/tipos_cambio');
    return asList(content, 'listaTiposCambio');
  } catch (error) {
    return [];
  }
};

export const getTiposCombustivel = async () => {
  try {
    const {
      data: { content },
    } = await api.get('/cliente/listagem/tipos_combustivel');
    return asList(content, 'listaTiposCombustivel');
  } catch (error) {
    return [];
  }
};

export const getOpcionais = async () => {
  const {
    data: { content },
  } = await api.get('/cliente/listagem/opcionais');
  return asList(content, 'listaOpcionais');
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const levenshtein = (left: string, right: string) => {
  const rows = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i++) rows[i][0] = i;
  for (let j = 0; j <= right.length; j++) rows[0][j] = j;
  for (let i = 1; i <= left.length; i++) {
    for (let j = 1; j <= right.length; j++) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
    }
  }
  return rows[left.length][right.length];
};

const tokensClose = (left: string, right: string) => {
  if (!left || !right) return false;
  if (left === right || left.includes(right) || right.includes(left)) return true;
  return left.length >= 5 && right.length >= 5 && levenshtein(left, right) <= 2;
};

const textQuery = (value?: string) => {
  if (!value || /^\d+$/.test(value.trim())) return '';
  return value.trim();
};

const brandMatches = (adBrand: string, selected: string) => {
  const ad = normalizeText(adBrand || '');
  const label = normalizeText(selected);
  if (!label) return true;
  if (!ad) return false;
  if (tokensClose(ad, label)) return true;

  const ignored = new Set(['de', 'da', 'do', 'e']);
  const tokens = label.split(' ').filter((token) => token.length >= 2 && !ignored.has(token));
  const adTokens = ad.split(' ');
  return tokens.some((token) => (
    tokensClose(ad, token) || adTokens.some((part) => tokensClose(part, token))
  ));
};

const includesQuery = (query: string, ...fields: Array<string | undefined>) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return fields.some((field) => {
    const normalizedField = normalizeText(field || '');
    return normalizedField.includes(normalizedQuery) || (normalizedField && normalizedQuery.includes(normalizedField));
  });
};

const toApiFilters = (properties: FilterOptions): FilterOptions => {
  const apiParams: FilterOptions = { ...properties };
  delete apiParams.cidade_nome;
  delete apiParams.marca;
  delete apiParams.id_marca;
  delete apiParams.modelo;
  delete (apiParams as FilterOptions & { id_modelo?: number }).id_modelo;
  delete apiParams.versao_veiculo;

  if (!apiParams.ordenacao) delete apiParams.ordenacao;
  if (apiParams.ano && apiParams.ano.min == null && apiParams.ano.max == null) {
    delete apiParams.ano;
  }
  if (apiParams.valor && apiParams.valor.min == null && apiParams.valor.max == null) {
    delete apiParams.valor;
  }

  return apiParams;
};

export const getFilteredData = async (
  properties: FilterOptions
): Promise<FilteredApiResponse> => {
  const marca = textQuery(properties.marca);
  const modelo = textQuery(properties.modelo);
  const versao = textQuery(properties.versao_veiculo);

  const {
    data: { content },
  } = await api.post('/cliente/anuncios/filtrar', toApiFilters(properties));

  const response = content as FilteredApiResponse;
  if (!marca && !modelo && !versao) return response;

  const anuncios = (response.anuncios || []).filter((ad) => {
    if (marca && !brandMatches(ad.marca_veiculo, marca)) return false;
    if (modelo && !includesQuery(modelo, ad.modelo_veiculo, ad.submodelo)) return false;
    if (versao && !includesQuery(versao, ad.submodelo, ad.modelo_veiculo)) return false;
    return true;
  });

  return {
    ...response,
    anuncios,
    total: anuncios.length,
  };
};

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

  const filteredData = await getFilteredData(properties);

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
