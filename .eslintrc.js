module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "google"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "settings": {
    react: {
      "version": "detect"
    }
  },
  "rules": {
    "linebreak-style": 0,
    "quotes": [2, "double"],
    "indent": [2, 2, { SwitchCase: 1 }],
    "object-curly-spacing": [2, "always"],
    "max-len": [1, { "code": 120 }],
    "comma-dangle": [2, "never"],
    "spaced-comment": 0,
    "operator-linebreak": 0,
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": 1,

    "require-jsdoc": 0,
    "react/display-name": 0
  }
};
