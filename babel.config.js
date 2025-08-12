module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@fonts': './src/assets/fonts',
            '@images': './src/assets/images',
            '@icons': './src/assets/icons',
            '@components': './src/components',
            '@contexts': './src/context',
            '@storage': './src/storage',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@services': './src/services',
            '@screens': './src/screens',
            '@lib': './src/lib',
            '@routes': './src/routes',
            '@hooks': './src/hooks',
          },
        },
      ],
    ],
  }
}
