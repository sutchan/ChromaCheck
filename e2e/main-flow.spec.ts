// e2e/main-flow.spec.ts — 主链路回归（任务 O-03）
// chromacheck v1.17.6
import { expect, test, type Locator, type Page } from '@playwright/test';

// Next 客户端导航在冷启动时偶发吞掉首次点击，受限重试避免把环境抖动误判为功能失败
async function clickAndWaitForUrl(page: Page, locator: Locator, expected: RegExp) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await locator.click();
    try {
      await expect(page).toHaveURL(expected, { timeout: 8000 });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(300);
    }
  }
}

test('首页 → 指引 → 石原氏快速 → 结果', async ({ page }) => {
  test.setTimeout(60000);
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(`console: ${message.text()}`);
  });

  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();

  await clickAndWaitForUrl(page, page.locator('#home-start-cta'), /\/guide$/);
  await clickAndWaitForUrl(page, page.locator('#guide-start-cta'), /\/test$/);
  await clickAndWaitForUrl(page, page.locator('#mode-quick-link'), /\/test\/ishihara\/quick$/);

  // 真实流程含演示题反馈、章末过渡与正式答题；按页面状态推进而非按题号硬编码
  const waitForNextStep = async () => {
    // 作答反馈缓冲为 420ms，先让当前提交 / 继续动作落地，避免旧按钮造成重复推进
    await page.waitForTimeout(600);
    try {
      await page.waitForFunction(() => {
        const input = document.querySelector('#answer') as HTMLInputElement | null;
        if (input && !input.disabled) return true;
        const buttons = Array.from(document.querySelectorAll('button'));
        if (buttons.some((button) => /^(继续|继续检测|完成作答|完成检测)$/.test((button.textContent || '').trim()))) {
          return true;
        }
        return /^\/result\//.test(location.pathname);
      }, null, { timeout: 15000 });
    } catch (error) {
      if (pageErrors.length > 0) throw new Error(`页面异常阻断答题流程：${pageErrors.join(' | ')}`);
      throw error;
    }
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
  expect(pageErrors).toEqual([]);
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
