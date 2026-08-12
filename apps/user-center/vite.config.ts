import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/user-center/" : "/",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name: "user-center",
      filename: "remoteUserCenter.js",
      exposes: {
        "./index": "./src/App.tsx"
      },
      shared: ["react", "react-dom", "react-router-dom"],
      bundleAllCSS: true
    })
  ]
}));

