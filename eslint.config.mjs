import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default tseslint.config(
  { ignores: ["prisma/generated/**"] },
  { files: ["src/**/*.ts"] },
  eslint.configs.recommended,
  tseslint.configs.strict,
  eslintPluginPrettierRecommended
)
