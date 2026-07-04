/**
 * Root ESLint config (root: true — no package overrides this).
 * Enforces CLAUDE.md rule 1: process.env may only be read in
 * packages/config/src/env.ts. Every other module must import the typed
 * `env` object from @gch/config instead.
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: { node: true, browser: true, es2022: true },
  ignorePatterns: ['dist/**', '.next/**', 'node_modules/**', '.turbo/**'],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[object.name='process'][property.name='env']",
        message:
          'process.env must only be read in packages/config/src/env.ts (CLAUDE.md rule 1). Import the typed `env` object from @gch/config instead.'
      }
    ]
  },
  overrides: [
    {
      files: ['packages/config/src/env.ts'],
      rules: { 'no-restricted-syntax': 'off' }
    },
    {
      // Tests may stub process.env to exercise the env loader itself
      files: ['**/test/**/*.ts', '**/*.test.ts'],
      rules: { 'no-restricted-syntax': 'off' }
    }
  ]
};
