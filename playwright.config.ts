// playwright.config.ts — 主链路 E2E 配置（任务 O-03）
// chromacheck v1.17.6
import { defineConfig, devices } from '@playwright/test';

// 每次运行使用独立目录，避开 IDE safe-delete 护栏并防止 E2E 产物污染仓库根
const runId = process.env.E2E_RUN_ID ?? new Date().toISOString().replace(/[:.]/g, '-');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 2,
  reporter: [['list']],
  outputDir: `.tmp/e2e-results/${runId}`,
  use: {
    baseURL: 'http://127.0.0.1:3101',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- -p 3101 -H 127.0.0.1',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
