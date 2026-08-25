import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // These utilities only need lightweight platform mocks, not a browser DOM.
    // 这些工具只需要轻量的平台 Mock，不需要完整的浏览器 DOM 环境。
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
  },
});
