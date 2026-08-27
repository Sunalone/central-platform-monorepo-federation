import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/payment-center/" : "/",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name: "payment-center",
      filename: "remotePaymentCenter.js",
      exposes: {
        "./index": "./src/App.tsx"
      },
      shared: {
        react: { singleton: true, requiredVersion: "19.2.7" },
        "react-dom": { singleton: true, requiredVersion: "19.2.7" },
        "react-router-dom": { singleton: true, requiredVersion: "7.18.1" },
        antd: { singleton: true, requiredVersion: "6.5.0" },
        "@ant-design/icons": { singleton: true, requiredVersion: "6.3.2" }
      },
      bundleAllCSS: true
    })
  ]
}));
