const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        clearTimeout: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        Math: 'readonly',
        google: 'readonly'
      }
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'arrow-body-style': 'off',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-console': 'warn',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration[async=true]',
          message: 'Async functions are not allowed'
        },
        {
          selector: 'FunctionExpression[async=true]',
          message: 'Async functions are not allowed'
        },
        {
          selector: 'ArrowFunctionExpression[async=true]',
          message: 'Async arrow functions are not allowed'
        },
        {
          selector: 'AwaitExpression',
          message: 'Await expressions are not allowed'
        },
        {
          selector: 'FunctionDeclaration[generator=true]',
          message: 'Generator functions are not allowed'
        },
        {
          selector: 'FunctionExpression[generator=true]',
          message: 'Generator functions are not allowed'
        },
        {
          selector: 'YieldExpression',
          message: 'Yield expressions are not allowed'
        }
      ]
    }
  }
];
