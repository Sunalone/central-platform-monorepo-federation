import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
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
});
