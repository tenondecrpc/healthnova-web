import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      exclude: [
        "node_modules",
        ".next",
        "e2e",
        "tests",
        "*.config.*",
        "src/app/layout.tsx",
      ],
    },
  },
});
