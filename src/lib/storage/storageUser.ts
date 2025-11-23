import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER_STORAGE } from '@lib/storage/storageConfig';

export interface UserDTO {
  id: number;
  access_token?: string;
  email: string;
  nome: string;
  role: string;
  tipo: 'PF' | 'PJ' | 'A';
  
  telefone?: string;
  celular?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  id_cidade?: number;
  
  num_documento?: string;
  data_nasc?: string;
  
  nome_fantasia?: string;
  nome_responsavel?: string;
  cpf_responsavel?: string;
  inscricao_estadual?: string;
  rg?: string;
  
  [key: string]: any;
}

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const user: UserDTO = storage ? JSON.parse(storage) : {};

  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
