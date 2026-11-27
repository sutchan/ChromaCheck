// e2e/main-flow.spec.ts — 主链路回归（任务 O-03）
// chromacheck v1.17.3
import { expect, test } from '@playwright/test';

test('首页 → 指引 → 石原氏快速 → 结果', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();

  await page.getByRole('link', { name: /开始检测/ }).first().click();
  await expect(page).toHaveURL(/\/guide$/);

  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /开始检测/ }).click();
  await expect(page).toHaveURL(/\/test$/);

  await page.getByRole('button', { name: /快速检测/ }).click();
  await expect(page).toHaveURL(/\/test\/ishihara\/quick$/);

  // 题库为按钮式作答；点击任一可用选项直到进入结果页
  for (let i = 0; i < 12; i += 1) {
    if (/\/result\//.test(page.url())) break;
    const option = page.getByRole('button', { name: /^[0-9]$/ }).first();
    if ((await option.count()) === 0) break;
    await option.click();
  }
  await expect(page).toHaveURL(/\/result\//, { timeout: 30000 });
  await expect(page.locator('#app-footer')).toContainText(/build \d{10}/);
});

test('语言切换后 html lang 与所选语言一致（O-02 回归）', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.getByRole('button', { name: /简体中文|语言|设置/ }).first().click();
  const tw = page.getByText('繁體中文', { exact: true }).first();
  if ((await tw.count()) > 0) {
    await tw.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  }
});
