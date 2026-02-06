require('dotenv').config();

const cleanEnvValue = (value) => {
  if (!value) return value;
  // Guard against common mistakes like: API_URL="http://...", (comma at EOL)
  return String(value).trim().replace(/^"+|"+$/g, '').replace(/,+$/g, '');
};

const isDev = process.env.NODE_ENV !== 'production';
const defaultApiUrl = isDev
  ? 'http://192.168.0.30:8000/api'
  : 'https://api-repasses.arietedigital.com.br/api';

const apiUrlFromEnv = isDev
  ? cleanEnvValue(process.env.API_URL_DEV) || cleanEnvValue(process.env.API_URL_PROD)
  : cleanEnvValue(process.env.API_URL_PROD) || cleanEnvValue(process.env.API_URL_DEV);

module.exports = {
  expo: {
    name: 'Repasse Rápido',
    slug: 'repasse-rapido',
    owner: "andrehf8",
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: 'com.repasserapido.client',
    plugins: [
      "expo-font",
      'expo-system-ui',
      [
        'expo-image-picker',
        {
          photosPermission: 'Este app precisa acessar suas fotos para você adicionar imagens aos seus anúncios.',
          cameraPermission: 'Este app precisa acessar sua câmera para você tirar fotos dos seus anúncios.',
        },
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#9A0B26",
          "image": "./assets/splash-icon.png",
          "imageWidth": 200
        }
      ]
    ],
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.repasserapido.client',
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.repasserapido.client',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#E11138',
      },
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'com.repasserapido.client',
              host: '*',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiUrl: apiUrlFromEnv || defaultApiUrl,
      eas: {
        projectId: '3f7e8885-01f1-45b1-b8ab-f4a284f7e3f2',
      },
    },
  },
};
