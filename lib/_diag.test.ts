// lib/_diag.test.ts — 临时诊断（跑完即删）
// @vitest-environment jsdom
import { it } from 'vitest';

it('diag', () => {
  console.log('typeof window =', typeof window);
  console.log('typeof window.localStorage =', typeof (window as { localStorage?: unknown }).localStorage);
  console.log('typeof globalThis.localStorage =', typeof globalThis.localStorage);
  console.log('window.location.href =', window.location.href);
});
