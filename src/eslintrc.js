module.exports = {
  env: {
      browser: true,
      es2021: true,
  },
  extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      // You can add other configurations if needed
  ],
  parserOptions: {
      ecmaFeatures: {
          jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
      // Add any custom rules here
  },
  settings: {
      react: {
          version: 'detect', // Automatically detect the React version
      },
  },
};