import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "prefer-const": "warn",
      "react-hooks/set-state-in-effect": "off",
    },
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/rss.xml",
      "src/generated/**",
    ],
  },
];

export default eslintConfig;
