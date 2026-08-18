import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import { emitPdfCMapAssets } from "@central-platform/tools/pdf/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/protocol-center/" : "/",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    emitPdfCMapAssets(),
    federation({
      name: "protocol-center",
      filename: "remoteProtocolCenter.js",
      exposes: {
        "./index": "./src/App.tsx"
      },
      shared: ["react", "react-dom"],
      bundleAllCSS: true
    })
  ]
}));
