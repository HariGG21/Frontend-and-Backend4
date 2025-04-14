import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // "@typescript-eslint/no-unused-vars": "warn",
      // "react/no-unescaped-entities": "warn",
      // Explicitly enable automatic fixes (if available)
      "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      "react/no-unescaped-entities": "warn",
    },
  },
];