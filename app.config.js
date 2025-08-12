import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

export default {
  expo: {
    name: 'Repasse Rápido',
    slug: 'repasse-rapido',
    version: '2.3.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'Este app acessa suas fotos e arquivos de imagens.',
        },
      ],
    ],
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#E11138',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.repasserapido.client',
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
    },
    android: {
      package: 'com.repasserapido.client',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#E11138',
      },
      buildToolsVersion: '35.0.0',
      compileSdkVersion: 35,
      targetSdkVersion: 35,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiUrl: isProd ? process.env.API_URL_PROD : process.env.API_URL_DEV,
      eas: {
        projectId: '2ae5524d-9fc1-48b1-a000-6798b747fa4a',
      },
    },
  },
};
