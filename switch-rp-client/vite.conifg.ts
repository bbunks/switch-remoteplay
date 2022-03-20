import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import typescriptPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [typescriptPaths(), react()],
});
