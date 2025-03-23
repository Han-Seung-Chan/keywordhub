module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "unused-imports",
    "simple-import-sort",
  ],
  rules: {
    // TypeScript 관련 규칙
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "off", // unused-imports 플러그인으로 대체
    "@typescript-eslint/no-require-imports": "error",

    // React 관련 규칙
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "warn",

    // import 순서 정렬 규칙
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    // 미사용 import 정리
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // // 일반 코드 품질 규칙
    // "no-console": ["warn", { allow: ["warn", "error"] }],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-var": "error",
    "prefer-const": "error",
  },
  settings: {
    next: {
      rootDir: ["./"],
    },
  },
  overrides: [
    {
      files: [
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/**/route.ts",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
