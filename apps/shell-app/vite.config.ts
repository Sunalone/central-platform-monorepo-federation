import { federation } from '@module-federation/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name: 'shell',
      remotes: {
        'product-center': {
          type: 'module',
          name: 'product-center',
          entry: 'http://localhost:4001/remoteProductCenter.js',
          entryGlobalName: 'product-center',
          shareScope: 'default',
        },
        'protocol-center': {
          type: 'module',
          name: 'protocol-center',
          entry: 'http://localhost:4002/remoteProtocolCenter.js',
          entryGlobalName: 'protocol-center',
          shareScope: 'default',
        },
        'payment-center': {
          type: 'module',
          name: 'payment-center',
          entry: 'http://localhost:4003/remotePaymentCenter.js',
          entryGlobalName: 'payment-center',
          shareScope: 'default',
        },
        'user-center': {
          type: 'module',
          name: 'user-center',
          entry: 'http://localhost:4004/remoteUserCenter.js',
          entryGlobalName: 'user-center',
          shareScope: 'default',
        },
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
      dts: false,
    }),
  ],
});
