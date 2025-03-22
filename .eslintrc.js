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
    "plugin:tailwindcss/recommended",
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
    "tailwindcss",
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
    "react/react-in-jsx-scope": "off", // Next.js에서는 React import가 필요 없음
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "warn",

    // import 순서 정렬 규칙
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // 1. React, Next.js 관련 패키지
          ["^react", "^next", "^@?\\w"],
          // 2. 타입 import
          ["^@/types"],
          // 3. 컴포넌트 import
          ["^@/components"],
          // 4. 훅 import
          ["^@/hooks"],
          // 5. 유틸리티, 서비스 함수 import
          ["^@/utils", "^@/services", "^@/lib", "^@/api"],
          // 6. 상수, 환경 변수 등 import
          ["^@/constants", "^@/config"],
          // 7. 스타일 관련 import
          ["^@/styles"],
          // 8. 상대 경로 import
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          // 9. 타입 import
          ["^[^.].*\\u0000$", "^\\./.*\\u0000$"],
        ],
      },
    ],
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

    // Tailwind CSS 관련 규칙
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/enforces-shorthand": "warn",

    // 일반 코드 품질 규칙
    "no-console": ["warn", { allow: ["warn", "error"] }],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-var": "error",
    "prefer-const": "error",
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "clsx", "twMerge"],
      config: "tailwind.config.js",
    },
    next: {
      rootDir: ["./"],
    },
  },
  overrides: [
    {
      // Next.js의 특정 파일에 대한 설정 오버라이드
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
