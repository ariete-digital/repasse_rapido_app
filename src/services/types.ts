
export interface VehicleOwnerResponse {
  status: string;
  content: VehicleOwnerContent;
}

interface VehicleOwnerContent {
  anunciante: Anunciante;
}

interface Anunciante {
  id: number;
  nome: string;
  telefone: string;
  celular: string;
  cidade: Cidade;
}

interface Cidade {
  id: number;
  nome: string;
}
