import { spawnSync } from 'node:child_process';
const r = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--reporter=dot'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: { ...process.env, CI: 'true' },
});
process.exit(r.status ?? 1);
