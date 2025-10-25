interface ApiResponse {
  status: string;
  content: Content;
}

export interface Content {
  anuncio: Offer;
  aceitouTermos: boolean;
  existePedido: boolean;
}

interface Offer {
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
  valor_fipe?: any;
  renavam: string;
  placa: string;
  status_veiculo: string;
  ano_fabricacao: string;
  ano_modelo: string;
  quilometragem: number;
  num_portas: string;
  tipo_motor?: any;
  tipo_motor_str: string;
  refrigeracao?: any;
  refrigeracao_str: string;
  cilindrada?: any;
  cilindrada_str?: any;
  partida?: any;
  partida_str: string;
  freios?: any;
  freios_str: string;
  tipo_freio?: any;
  tipo_freio_str: string;
  alimentacao?: any;
  alimentacao_str: string;
  alarme?: any;
  controle_estabilidade?: any;
  roda_liga?: any;
  unico_dono: number;
  unico_dono_str: string;
  tipo_troca: string;
  tipo_troca_str: string;
  ipva_pago: number;
  veiculo_nome_anunciante: number;
  financiado: number;
  parcelas_em_dia?: any;
  aceita_financiamento: string;
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
  luz_injecao: number;
  luz_airbag: number;
  luz_abs: number;
  tipo_monta: string;
  tipo_monta_str: string;
  furtado_roubado: number;
  valor: string;
  descricao: string;
  aceite_termos: number;
  id_cliente: number;
  id_plano?: any;
  id_modelo: number;
  id_cor: number;
  id_tipo_cambio: number;
  id_tipo_combustivel: number;
  id_tipo_pneu: number;
  id_tipo_parabrisa: number;
  status_str: string;
  moderacao_str: string;
  moderacao_aprovada?: any;
  num_cliques: number;
  obs_moderacao?: any;
  created_at: string;
  publicado_em?: string | null;
  vendido_em?: string | null;
  ativo: boolean;
  pausado: boolean;
  codigo: string;
  cidadeAnunciante: string;
  is_vencido?: boolean;
  cliente?: {
    id: number;
    nome: string;
    num_documento: string;
    isPJ: boolean;
    telefone: string;
    celular: string | null;
    nome_fantasia: string | null;
    nome_responsavel: string | null;
    cpf_responsavel: string | null;
    selo: string | null;
    cidade?: {
      id: number;
      nome: string;
    };
  };
  cor: Item;
  tipo_cambio: Item;
  tipo_combustivel: Item;
  tipo_pneu: Item;
  tipo_parabrisa: Item;
  opcionais: Item[];
  imagens: Array<{ link: string; principal?: number; arquivo?: string }> | string[];
  imagemPrincipal?: string;
  usuarioModeracao?: {
    email: string;
    id: number;
    nome: string;
  };
  avaliacoes?: any[];
}

interface Item {
  id: number;
  descricao: string;
}

interface DetailsProps {
  route: { params: { code: string } };
}

export { Offer, ApiResponse, DetailsProps };
