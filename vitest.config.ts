import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Minimal Vitest setup so the calculator math in `src/lib/calc` is actually
 * verifiable. The only thing needed beyond defaults is the `@/` path alias
 * that tsconfig defines — without it the test files fail to resolve imports.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
