const FEATURE_PUBLIC_API = 'index.ts';

module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:boundaries/recommended'],
  plugins: ['boundaries'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    'boundaries/include': ['src/**/*'],
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      {
        type: 'feature',
        pattern: 'src/features/*',
        capture: ['featureName'],
      },
      { type: 'shared', pattern: 'src/shared' },
      { type: 'assets', pattern: 'src/assets' },
    ],
  },
  rules: {
    'boundaries/no-unknown-files': 'error',
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        message:
          '"{{from.element.types}}" não pode importar este arquivo de "{{to.element.types}}". Features só são importadas pelo index.ts. Veja docs/arquitetura.md.',
        policies: [
          {
            from: { element: { type: 'app' } },
            allow: {
              to: [
                { element: { type: ['shared', 'assets'] } },
                {
                  element: {
                    type: 'feature',
                    fileInternalPath: FEATURE_PUBLIC_API,
                  },
                },
              ],
            },
          },
          {
            from: { element: { type: 'feature' } },
            allow: {
              to: [
                { element: { type: ['shared', 'assets'] } },
                {
                  element: {
                    type: 'feature',
                    fileInternalPath: FEATURE_PUBLIC_API,
                  },
                },
              ],
            },
          },
          {
            from: { element: { type: 'shared' } },
            allow: { to: { element: { type: 'assets' } } },
          },
        ],
      },
    ],
    'eslint-comments/require-description': [
      'error',
      { ignore: ['eslint-enable'] },
    ],
  },
  overrides: [
    {
      files: ['jest.setup.js'],
      env: { jest: true },
    },
    {
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['..', '../', '../*'],
                message:
                  'Imports com "../" são proibidos. Use o alias @/ (ex.: @/features/<nome>/hooks/useX). Veja docs/convencoes.md.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
  ],
};
