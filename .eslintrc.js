module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  overrides: [
    {
      files: ["**/*.test.js"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      env: {
        "jest/globals": true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
