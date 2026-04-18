import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    globalSetup: "./src/__tests__/global-setup.ts",
    include: ["src/__tests__/**/*.test.ts"],
    testTimeout: 15000,
  },
});
