import babel from "@rolldown/plugin-babel";
import { emitPdfCMapAssets } from "@central-platform/tools/pdf/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const reactSpringTypesShim = new URL(
  "./src/shims/reactSpringTypes.ts",
  import.meta.url,
).pathname;

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/mobile-app/" : "/",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), emitPdfCMapAssets()],
  resolve: {
    alias: {
      "@react-spring/types/animated": reactSpringTypesShim,
      "@react-spring/types/interpolation": reactSpringTypesShim,
    },
  },
}));
