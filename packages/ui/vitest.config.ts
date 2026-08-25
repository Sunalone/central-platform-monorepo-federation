import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // UI 组件依赖浏览器 DOM，因此使用 jsdom 模拟运行环境。
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts?(x)'],
    clearMocks: true,
  },
});
