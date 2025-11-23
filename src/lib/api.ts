import axios from 'axios';
import Constants from 'expo-constants';

interface AppConfig {
  apiUrl: string;
}

const { apiUrl } = Constants.expoConfig?.extra as AppConfig;

const baseURL = process.env.API_URL_PROD || apiUrl || 'https:

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      
    }
    return Promise.reject(error);
  }
);
