// vitest.config.ts v1.17.0
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // 与 tsconfig 的 paths 对齐：app/ 下模块统一用 @/ 别名，SEO 回归测试需加载 sitemap / route handlers
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)).replace(/[\\/]$/, '') },
  },
  test: {
    // 判读引擎为纯函数、storage 封装仅依赖标准 Storage API：统一 node 环境，
    // 由 vitest.setup.ts 注入内存版 localStorage（规避 Node 26 实验性实现与 DOM 模拟的冲突）
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['lib/**/*.test.ts'],
  },
});
