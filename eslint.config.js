// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    // Enable typed linting via the typescript-eslint Project Service.
    // This is slower than untyped linting; see https://typescript-eslint.io/getting-started/typed-linting
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      angular.configs.tsRecommended,
      eslintConfigPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // ESLint
      curly: "error",
      "default-case-last": "warn",
      "no-useless-assignment": "warn",
      "no-empty": "warn",
      "prefer-const": "warn",

      // Typescript ESLint
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { overrides: { constructors: "no-public" } },
      ],
      "@typescript-eslint/member-ordering": [
        "error",
        { default: ["signature", "field", "constructor", "method"] },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Angular ESLint
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
