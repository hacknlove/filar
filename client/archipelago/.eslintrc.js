module.exports = {
  env: {
    browser: true,
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
    sourceType: "module",
  },
  rules: {},
};
