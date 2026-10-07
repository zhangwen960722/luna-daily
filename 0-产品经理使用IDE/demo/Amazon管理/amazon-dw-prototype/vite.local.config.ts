import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// 本地纯前端入口，不加载托管插件、认证、Worker 或数据库。
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  css: { postcss: { plugins: [] } },
  server: { host: "127.0.0.1", port: 5178, strictPort: true },
  build: { outDir: "dist-local", emptyOutDir: true },
});
