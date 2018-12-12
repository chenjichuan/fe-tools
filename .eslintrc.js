module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/no-parsing-error": 'off', //Input 报错
    "vue/max-attributes-per-line": 'off', // 属性换行
    "vue/attributes-order": 'off', // 属性位置
    "vue/require-default-prop": 'off', //
    "vue/require-v-for-key": 'off', //
    "vue/valid-v-for": 'off', //
    "vue/html-indent": 'off' //
  }
}
