/** @type {import('eslint').Linter.Config} */

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@tanstack/query', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  rules: {
    'react/display-name': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'import/no-anonymous-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-implicit-any-index': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off'
  },
  overrides: [
    {
      files: ['ProcessEnv.d.ts'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off'
      }
    }
  ],

  // ESlint default behavior ignores file/folders starting with "." - https://github.com/eslint/eslint/issues/10341
  ignorePatterns: [
    '!.*',
    'node_modules',
    '.next',
    '.turbo',
    'dist',
    'compiled',
    // Files bellow are not git ignored. Eslint fix in the making https://github.com/eslint/eslint/issues/15010
    'VersionInfo.ts',
    'next-env.d.ts'
  ],

  settings: {
    typescript: {},
    'import/resolver': {
      typescript: {
        project: [
          './tsconfig.json',
          'apps/*/tsconfig.json',
          'apps/**/*/tsconfig.json',
          'apps/**/**/*/tsconfig.json',
          'packages/*/tsconfig.json'
        ]
      }
    },
    react: {
      version: 'detect'
    }
  },
  globals: {
    JSX: 'readonly'
  }
}
