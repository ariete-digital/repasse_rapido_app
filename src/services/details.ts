import { api } from '@lib/api';

export interface AnuncioDetails {
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
  renavam: string;
  placa: string;
  status_veiculo: string;
  ano_fabricacao: string;
  ano_modelo: string;
  quilometragem: number;
  num_portas: string;
  tipo_motor: string | null;
  tipo_motor_str: string;
  refrigeracao: string | null;
  refrigeracao_str: string;
  cilindrada: string | null;
  cilindrada_str: string | null;
  partida: string | null;
  partida_str: string;
  freios: string | null;
  freios_str: string;
  tipo_freio: string | null;
  tipo_freio_str: string;
  alimentacao: string | null;
  alimentacao_str: string;
  alarme: string | null;
  controle_estabilidade: string | null;
  roda_liga: string | null;
  unico_dono: number;
  unico_dono_str: string;
  tipo_troca: string | null;
  tipo_troca_str: string;
  ipva_pago: number;
  veiculo_nome_anunciante: number;
  financiado: number;
  parcelas_em_dia: number | null;
  aceita_financiamento: string | null;
  todas_revisoes_concessionaria: number;
  passou_leilao: number;
  possui_manual: number;
  possui_chave_reserva: number;
  possui_ar: number;
  ar_funcionando: number;
  escapamento_solta_fumaca: number;
  garantia_fabrica: number;
  motor_bate: number;
  cambio_faz_barulho: number;
  cambio_escapa_marcha: number;
  luz_injecao: number | null;
  luz_airbag: number | null;
  luz_abs: number | null;
  tipo_monta: string | null;
  tipo_monta_str: string;
  furtado_roubado: number;
  valor: string;
  descricao: string;
  aceite_termos: number;
  id_cliente: number;
  id_plano: number | null;
  id_modelo: number | null;
  id_cor: number;
  id_tipo_cambio: number;
  id_tipo_combustivel: number;
  id_tipo_pneu: number;
  id_tipo_parabrisa: number;
  status_str: string;
  moderacao_str: string;
  moderacao_aprovada: boolean | null;
  num_cliques: number;
  obs_moderacao: string | null;
  created_at: string;
  publicado_em: string | null;
  vendido_em: string | null;
  ativo: boolean;
  pausado: boolean;
  codigo: string;
  is_vencido: boolean;
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
  tipo_pneu: {
    id: number;
    descricao: string;
  };
  tipo_parabrisa: {
    id: number;
    descricao: string;
  };
  opcionais: Array<{
    id: number;
    descricao: string;
  }>;
  avaliacoes: Array<any>;
  imagens: string[];
  imagemPrincipal?: string;
}

export interface Anunciante {
  id: number;
  nome: string;
  telefone: string;
  celular: string | null;
  cidade: {
    id: number;
    nome: string;
  };
}

export interface AnuncioDetailsResponse {
  anuncio: AnuncioDetails;
  aceitouTermos: boolean;
  existePedido: boolean;
  anunciante: Anunciante;
}

export interface AvaliacaoRequest {
  id_anuncio: number;
  nota: number;
  comentario: string;
}

export interface AvaliacaoResponse {
  message: string;
}

// Buscar detalhes do anúncio
export const getAnuncioDetails = async (codigo: string): Promise<AnuncioDetailsResponse> => {
  const { data } = await api.get(`/cliente/anuncios/detalhe?codigo=${codigo}`);
  return data.content;
};

// Salvar avaliação do anúncio
export const saveAvaliacao = async (avaliacao: AvaliacaoRequest): Promise<AvaliacaoResponse> => {
  const { data } = await api.post('/cliente/anuncios/salvar_avaliacao', avaliacao);
  return data.content;
};
