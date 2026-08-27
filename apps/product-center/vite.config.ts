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
      shared: {
        react: { singleton: true, requiredVersion: "19.2.7" },
        "react-dom": { singleton: true, requiredVersion: "19.2.7" },
        antd: { singleton: true, requiredVersion: "6.5.0" },
        "@ant-design/icons": { singleton: true, requiredVersion: "6.3.2" }
      },
      bundleAllCSS: true
    })
  ]
}));
