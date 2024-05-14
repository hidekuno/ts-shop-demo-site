import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      "arrow-body-style": "off",
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
      "linebreak-style": ["error","unix"],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/quotes": ["error", "single"],
      "@typescript-eslint/indent": ["error",2],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": '^_' }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/object-curly-spacing": "error",
      "@typescript-eslint/semi": "error",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/space-infix-ops": "error",
      "@typescript-eslint/lines-between-class-members": "error",
      "@typescript-eslint/no-extra-semi": "error",
    },
    settings: { react: { version: 'detect' } }
  }
];
