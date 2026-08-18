import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { federation } from "@module-federation/vite";
import { emitPdfCMapAssets } from "@central-platform/tools/pdf/vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/product-center/" : "/",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    emitPdfCMapAssets(),
    federation({
      name: "product-center",
      filename: "remoteProductCenter.js",
      exposes: {
        "./index": "./src/App.tsx",
        "./Button": "./src/components/Button/index.tsx"
      },
      shared: ["react", "react-dom"],
      bundleAllCSS: true
    })
  ]
}));
