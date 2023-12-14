module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true
  },
  extends: ["plugin:vue/vue3-essential", "@vue/standard"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    eqeqeq: "off",
    "vue/no-mutating-props": "off"
  }
};
