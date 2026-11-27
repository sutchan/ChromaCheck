// e2e/main-flow.spec.ts — 主链路回归（任务 O-03）
// chromacheck v1.17.6
import { expect, test } from '@playwright/test';

test('首页 → 指引 → 石原氏快速 → 结果', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();

  await page.locator('#home-start-cta').click();
  await expect(page).toHaveURL(/\/guide$/);

  await page.locator('#guide-start-cta').click();
  await expect(page).toHaveURL(/\/test$/);

  await page.locator('#mode-quick-link').click();
  await expect(page).toHaveURL(/\/test\/ishihara\/quick$/);

  // 真实流程含演示题反馈、章末过渡与正式答题；按页面状态推进而非按题号硬编码
  const waitForNextStep = async () => {
    // 作答反馈缓冲为 420ms，先让当前提交 / 继续动作落地，避免旧按钮造成重复推进
    await page.waitForTimeout(600);
    await page.waitForFunction(() => {
      const input = document.querySelector('#answer') as HTMLInputElement | null;
      if (input && !input.disabled) return true;
      const buttons = Array.from(document.querySelectorAll('button'));
      if (buttons.some((button) => /^(继续|继续检测|完成作答|完成检测)$/.test((button.textContent || '').trim()))) {
        return true;
      }
      return /^\/result\//.test(location.pathname);
    }, null, { timeout: 15000 });
  };

  for (let i = 0; i < 16; i += 1) {
    if (/\/result\//.test(page.url())) break;

    const continueButton = page.getByRole('button', { name: /^(继续|继续检测|完成作答|完成检测)$/ }).first();
    if (await continueButton.isVisible()) {
      await continueButton.click();
      await waitForNextStep();
      continue;
    }

    const answer = page.locator('#answer');
    if (await answer.isVisible() && await answer.isEnabled()) {
      await answer.fill('12');
      await page.getByRole('button', { name: /^提交$/ }).first().click();
      await waitForNextStep();
      continue;
    }

    const unclear = page.getByRole('button', { name: /看不清 \/ 无数字/ }).first();
    if (await unclear.isVisible()) {
      await unclear.click();
      await waitForNextStep();
    }
  }

  await expect(page).toHaveURL(/\/result\//, { timeout: 30000 });
  await expect(page.locator('#app-footer')).toContainText(/build \d{10}/);
});

test('语言切换后 html lang 与所选语言一致（O-02 回归）', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.getByRole('button', { name: /简体中文|语言|设置/ }).first().click();
  const tw = page.getByText('繁體中文', { exact: true }).first();
  await expect(tw).toBeVisible();
  await tw.click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
});
