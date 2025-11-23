import axios from 'axios';
import Constants from 'expo-constants';

interface AppConfig {
  apiUrl: string;
}

const { apiUrl } = Constants.expoConfig?.extra as AppConfig;

const baseURL = process.env.API_URL_PROD || apiUrl || 'https://api-repasses.arietedigital.com.br/api';

console.log('API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      console.log('Full URL:', config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error('API Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config?.baseURL + error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    
    if (error.response?.status === 401) {
      // Token expirado ou não autorizado
    }
    
    // Se não há resposta, pode ser problema de conexão
    if (!error.response) {
      console.error('Network Error - Verifique sua conexão com a internet');
    }
    
    return Promise.reject(error);
  }
);
