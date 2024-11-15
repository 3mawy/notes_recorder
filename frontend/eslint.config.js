import globals from "globals";
import pluginJs from "@eslint/js";
import jestConfig from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import { fixupPluginRules } from "@eslint/compat";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  jestConfig.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["node_modules", "dist/", "public/", "coverage/"],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020, // Equivalent of setting "env" in .eslintrc
      sourceType: "module",
    },
    plugins: {
      "react-hooks": fixupPluginRules(reactHooksPlugin),
    },
    settings: {
      react: {
        version: "detect", // Auto-detect the installed React version
      },
    },
    rules: {
      "no-undef": "off",
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react/react-in-jsx-scope": "off",
      "react/destructuring-assignment": "off",
      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".tsx", ".ts"],
        },
      ],
      "react/jsx-props-no-spreading": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      // "import/extensions": [
      //   "error",
      //   "ignorePackages",
      //   {
      //     "js": "never",
      //     "jsx": "never",
      //     "ts": "never",
      //     "tsx": "never"
      //   }
      // ],
      // "import/no-extraneous-dependencies": "off",
      "no-restricted-imports": [
        "error",
        {
          name: "@mui/material",
          message:
            "Please use \"import foo from '@mui/material/foo'\" instead. There's a SERIOUS performance hit if you dont use it this way, especially in unit testing",
        },
        "error",
        {
          name: "@mui/icons-material",
          message:
            "Please use \"import SearchIcon from '@mui/icons-material/Search'\" instead. There's a SERIOUS performance hit if you dont use it this way, especially in unit testing",
        },
      ],
    },
  },
];
