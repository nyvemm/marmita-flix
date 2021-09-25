module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: ['plugin:vue/base', 'eslint:recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': 0,
    camelcase: 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/order-in-components': 1,
    'vue/require-default-prop': 'off'
  }
}
