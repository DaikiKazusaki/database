import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // 対象は app/lib のロジックだけ。UIコンポーネントは含めていない
    include: ["app/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    environment: "node",
  },
})
