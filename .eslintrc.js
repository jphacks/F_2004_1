module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false
      }
    ],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.jsx', '.tsx']
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
