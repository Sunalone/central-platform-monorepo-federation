import { federation } from '@module-federation/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isProduction = mode === 'production';
  const remoteEntry = (envName: string, productionPath: string, developmentUrl: string) =>
    env[envName] || (isProduction ? productionPath : developmentUrl);

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      federation({
        name: 'shell',
        remotes: {
          'product-center': {
            type: 'module',
            name: 'product-center',
            entry: remoteEntry(
              'VITE_PRODUCT_REMOTE_ENTRY',
              '/product-center/remoteProductCenter.js',
              'http://localhost:4001/remoteProductCenter.js',
            ),
            entryGlobalName: 'product-center',
            shareScope: 'default',
          },
          'protocol-center': {
            type: 'module',
            name: 'protocol-center',
            entry: remoteEntry(
              'VITE_PROTOCOL_REMOTE_ENTRY',
              '/protocol-center/remoteProtocolCenter.js',
              'http://localhost:4002/remoteProtocolCenter.js',
            ),
            entryGlobalName: 'protocol-center',
            shareScope: 'default',
          },
          'payment-center': {
            type: 'module',
            name: 'payment-center',
            entry: remoteEntry(
              'VITE_PAYMENT_REMOTE_ENTRY',
              '/payment-center/remotePaymentCenter.js',
              'http://localhost:4003/remotePaymentCenter.js',
            ),
            entryGlobalName: 'payment-center',
            shareScope: 'default',
          },
          'user-center': {
            type: 'module',
            name: 'user-center',
            entry: remoteEntry(
              'VITE_USER_REMOTE_ENTRY',
              '/user-center/remoteUserCenter.js',
              'http://localhost:4004/remoteUserCenter.js',
            ),
            entryGlobalName: 'user-center',
            shareScope: 'default',
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: '19.2.7' },
          'react-dom': { singleton: true, requiredVersion: '19.2.7' },
          'react-router-dom': { singleton: true, requiredVersion: '7.18.1' },
          antd: { singleton: true, requiredVersion: '6.5.0' },
          '@ant-design/icons': { singleton: true, requiredVersion: '6.3.2' },
        },
        dts: false,
      }),
    ],
  };
});
