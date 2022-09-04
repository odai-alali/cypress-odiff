module.exports = {
    plugins: ["cypress", "prettier"],
    env: {
      es2021: true,
      es6: true,
      node: true,
      mocha: true,
      "cypress/globals": true,
    },
    rules: {
      strict: "off",
      "prettier/prettier": "error",
    },
    extends: ["plugin:cypress/recommended"],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
  };
  