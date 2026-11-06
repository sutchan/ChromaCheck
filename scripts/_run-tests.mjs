import { spawnSync } from 'node:child_process';
const r = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--reporter=dot'], {
  encoding: 'utf8',
  env: { ...process.env, CI: 'true' },
  maxBuffer: 20 * 1024 * 1024,
});
const out = (r.stdout || '') + (r.stderr || '');
const lines = out.split('\n').filter(Boolean);
console.log(lines.slice(-14).join('\n'));
console.log('TEST_EXIT', r.status);
process.exit(r.status ?? 1);
