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

