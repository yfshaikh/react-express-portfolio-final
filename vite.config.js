import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  envPrefix: 'REACT-APP_',
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    envCompatible(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  root: '.', // the root directory where index.html is located
  resolve: {
    alias: {
      '@': '/src',
    },
  }
});
