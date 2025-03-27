import {defineConfig} from "vite";

import mkcert from "vite-plugin-mkcert";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import zipPack from "vite-plugin-zip-pack";

import path from "path";

const cwd = process.cwd();

export default defineConfig({
  plugins: [
    mkcert(),
    react(),
    tsconfigPaths({
      root: cwd,
    }),zipPack({
      inDir: path.join(cwd, "dist"),
      outDir: path.join(cwd, "dist"),
    }),],
  build: {
    emptyOutDir: true,
  },
  base: "./",
  preview: {
    port: 8080,
  }
})
