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
      shared: ["react", "react-dom", "react-router-dom"],
      bundleAllCSS: true
    })
  ]
}));
