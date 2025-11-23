 module.exports = {
  expo: {
    name: 'Repasse Rápido',
    slug: 'repasse-rapido',
    owner: "repasse-rapido",
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
      apiUrl: process.env.API_URL_PROD || 'https://api-repasses.arietedigital.com.br/api',
      eas: {
        projectId: '2b0cf35b-cdb7-43fa-8bf1-bd294cb41b9a',
      },
    },
  },
};
