// vitest.config.ts v1.7.6
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 判读引擎为纯函数，node 环境即可；storage 用例需要 DOM（jsdom 提供 window.localStorage）
    environment: 'node',
    environmentMatchGlobs: [['lib/storage.test.ts', 'jsdom']],
    include: ['lib/**/*.test.ts'],
  },
});
