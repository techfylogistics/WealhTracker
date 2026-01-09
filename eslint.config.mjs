import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";

export default [
  // =========================================
  // Lint ALL TS / TSX files in app + src
  // =========================================
  {
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}", "*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      boundaries,
    },
    rules: {
      // Example rule (you can expand later)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  // =========================================
  // Architecture boundary rules
  // =========================================
  {
    files: ["app/**/*.{ts,tsx}"],
     settings: {
      "boundaries/elements": [
        {
          "type": "app",
          "pattern": "app/*" // This tells ESLint that files in /app/ are of type "app"
        }
      ]
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["app"],
            },
          ],
        },
      ],
    },
  },
];
