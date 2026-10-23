module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
        ],
        alias: {
          '@/app': './src/app',
          '@/features': './src/features',
          '@/shared': './src/shared',
          '@/assets': './src/assets',
        },
      },
    ],
  ],
};
