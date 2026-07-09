import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { federation } from '@module-federation/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name: 'shell',
      remotes: {
        productCenter: {
          type: "module",          // vite mf 固定 module 类型（ESM）
          name: "product-center",    // 远程应用自身 name（必须和子应用 federation.name 一致）
          entry: "http://localhost:4001/remoteProductCenter.js", // 远程服务地址 + 远程入口文件
          entryGlobalName: "product-center", // 全局变量名，和子应用保持一致
          shareScope: "default", // 共享作用域
        }
      },
      shared: ['react', 'react-dom']
    })
  ],
})
