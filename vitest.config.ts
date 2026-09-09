// vitest.config.ts v1.7.7
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 判读引擎为纯函数、storage 封装仅依赖标准 Storage API：统一 node 环境，
    // 由 vitest.setup.ts 注入内存版 localStorage（规避 Node 26 实验性实现与 DOM 模拟的冲突）
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['lib/**/*.test.ts'],
  },
});
