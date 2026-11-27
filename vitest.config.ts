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
    // 覆盖率门禁（任务 O-03）：仅在 npm run test:coverage 时执行阈值判定
    coverage: {
      provider: 'v8',
      // Windows 盘符大小写导致 V8 报告同一文件两份，all=false 仅统计测试实际加载的源码
      all: false,
      reporter: ['text-summary', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['lib/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        'lib/i18n/**',
        'lib/questions/**',
        'lib/types.ts',
        'lib/site.ts',
        'lib/learn-data.ts',
        'lib/privacy-data.ts',
        'lib/fun.ts',
      ],
      thresholds: { lines: 80, functions: 75, branches: 70, statements: 80 },
    },
  },
});
