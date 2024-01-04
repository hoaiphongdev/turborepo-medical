/** @type {import('eslint').Linter.Config} */

module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', '@tanstack/query', 'import'],
	extends: [
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:jsx-a11y/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended',
		'plugin:no-array-reduce/recommended'
	],
	rules: {
		'react/display-name': 'off',
		'@next/next/no-img-element': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'no-nested-ternary': 'error',
		'no-unneeded-ternary': 'error',
		'spaced-comment': 'error',
		'id-length': ['error', { min: 2, properties: 'never' }],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/array-type': ['error', { default: 'generic' }],
		'@typescript-eslint/ban-types': 'error',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'@typescript-eslint/no-unnecessary-condition': 'error',
		'jsx-a11y/anchor-is-valid': ['off'],
		'@typescript-eslint/no-empty-function': 'off'
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
				project: ['./tsconfig.json', 'apps/*/tsconfig.json', 'packages/*/tsconfig.json']
			}
		},
		react: {
			version: 'detect'
		}
	}
};
