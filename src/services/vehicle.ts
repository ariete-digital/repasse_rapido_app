import { api } from '@lib/api';
import { ApiResponse } from '@screens/Details/types';
import { VehicleOwnerResponse } from './types';

export async function getVehicleDetails(code: string) {
  const {
    data: { content },
  } = await api.get<ApiResponse>(`cliente/anuncios/detalhe?codigo=${code}`);
  return content;
}

export async function getVechicleOwnerDetails(idOffer: number) {
  const {
    data: { content },
  } = await api.get<VehicleOwnerResponse>(
    `cliente/anuncios/obter_dados_anunciante?id_anuncio=${idOffer}`
  );

  return content;
}
