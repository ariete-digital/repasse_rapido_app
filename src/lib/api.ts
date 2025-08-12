import axios from 'axios';
import Constants from 'expo-constants';

interface AppConfig {
  apiUrl: string;
}

const { apiUrl } = Constants.expoConfig?.extra as AppConfig;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
