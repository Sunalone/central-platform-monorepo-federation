import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/mobile-app/" : "/",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })]
}));
