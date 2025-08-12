export interface ItemCardProps {
  itemID: number;
  imageUrl: string;
  brand: string;
  model: string;
  smallDescription: string;
  price: string;
  code: string;
}

export interface Banners {
  id?: number;
  title: string;
  subtitle?: string;
  url_imagem: string;
  link?: string;
}

export type Store = {
  id: number;
  nome: string;
  slug?: string;
  bairro: string;
  celular: string;
  complemento: string;
  logradouro: string;
  nome_fantasia: string;
  numero: string;
  telefone: string;
  imagem_logo?: string;
  imagem_capa?: string;
};
