import axios from 'axios';
import Constants from 'expo-constants';

interface AppConfig {
  apiUrl: string;
}

const { apiUrl } = Constants.expoConfig?.extra as AppConfig;

// Use API_URL_PROD from environment or fallback to the configured apiUrl
const baseURL = process.env.API_URL_PROD || apiUrl || 'https://api-repasses.arietedigital.com.br/api';


export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to handle token
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
);
