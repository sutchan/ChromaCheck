# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: main-flow.spec.ts >> 首页 → 指引 → 石原氏快速 → 结果
- Location: e2e\main-flow.spec.ts:5:1

# Error details

```
TimeoutError: page.waitForFunction: Timeout 5000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "跳到主内容" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - navigation [ref=e4]:
      - link "色辨 ChromaCheck" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e10]:
        - link "首页" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "开始检测" [ref=e12] [cursor=pointer]:
          - /url: /test
        - link "历史" [ref=e13] [cursor=pointer]:
          - /url: /history
        - button "打开设置" [ref=e14] [cursor=pointer]
  - main [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: 疑似色盲
            - heading "需进一步确认" [level=1] [ref=e24]
            - generic [ref=e25]: 快速版 · 2026-11-27 16:39
          - generic "内部质量估计，非医学统计置信度" [ref=e27]:
            - generic [ref=e28]: 判读稳定性（内部估计）
            - generic [ref=e29]: 57%
        - generic [ref=e30]:
          - generic [ref=e31]:
            - generic [ref=e32]: 正确题数
            - generic [ref=e33]: 1/10
          - generic [ref=e34]:
            - generic [ref=e35]: 用时
            - generic [ref=e36]: 0 分 08 秒
          - generic [ref=e37]:
            - generic [ref=e38]: 设备
            - generic [ref=e39]: Windows · Chrome 159
        - paragraph [ref=e42]: 快速版 · 你的结果提示色觉异常（重度）。消失题中多题数字难以辨认，这可能影响对红/绿相关色彩的区分；当前题库无法进一步区分红/绿异常类型，建议在职业选择与日常安全场景中多加留意。需注意：色弱（异常三色视觉）与色盲（二色视觉）不同，法规通常仅限制色盲，色弱一般不影响驾驶资格，但以体检机构结论为准。
        - generic [ref=e43]: 基于 1/10 题作答，综合判读稳定性 57%。
      - generic [ref=e44]:
        - generic [ref=e45]:
          - heading "驾照辨色力参考" [level=2] [ref=e49]
          - generic [ref=e50]: 疑似色盲（未分型）
        - paragraph [ref=e54]: 本次结果提示疑似色盲；但当前题库以消失型图版为主，无法区分红色觉与绿色觉异常，是否触及「无红绿色盲」要求需进一步确认。《机动车驾驶证申领和使用规定》（公安部令第 172 号，2024-12 修订）第十二条：辨色力——无红绿色盲。
        - paragraph [ref=e55]: 未分型：无法判定属于色弱或色盲，以体检机构结论为准。
        - paragraph [ref=e56]: 筛查结果仅作参考，不能替代专业眼科诊断；是否取得驾驶资格，以公安交管部门指定体检机构的结论为准。
      - generic [ref=e57]:
        - generic [ref=e58]:
          - heading "异常维度分布" [level=3] [ref=e59]
          - img "异常维度分布图" [ref=e60]:
            - generic [ref=e61]: "0"
            - generic [ref=e63]: "25"
            - generic [ref=e65]: "50"
            - generic [ref=e67]: "75"
            - generic [ref=e69]: "100"
            - generic [ref=e71]:
              - generic [ref=e73]: "100"
              - generic [ref=e74]: 红色觉轴
            - generic [ref=e75]:
              - generic [ref=e77]: "100"
              - generic [ref=e78]: 绿色觉轴
            - generic [ref=e79]:
              - generic [ref=e81]: "35"
              - generic [ref=e82]: 蓝色觉轴
          - paragraph [ref=e83]: 数值越高表示该轴异常倾向越明显，仅供参考。
        - generic [ref=e84]:
          - heading "错误模式分析" [level=3] [ref=e85]
          - generic [ref=e86]: 消失题中有 8 题未能读出数字
      - generic [ref=e91]:
        - heading "逐题明细（10 题）" [level=3] [ref=e92]
        - table "逐题明细（10 题）" [ref=e94]:
          - rowgroup [ref=e95]:
            - row [ref=e96]:
              - columnheader "图版" [ref=e97]
              - columnheader "题型" [ref=e98]
              - columnheader "你的答案" [ref=e99]
              - columnheader "标准" [ref=e100]
              - columnheader "判读" [ref=e101]
          - rowgroup [ref=e102]:
            - row [ref=e103]:
              - cell "#1" [ref=e104]
              - cell "演示题" [ref=e105]
              - cell "12" [ref=e106]
              - cell "12" [ref=e107]
              - cell "正确" [ref=e108]
            - row [ref=e112]:
              - cell "#2" [ref=e113]
              - cell "演示题" [ref=e114]
              - cell "12" [ref=e115]
              - cell "8" [ref=e116]
              - cell "异常" [ref=e117]
            - row [ref=e121]:
              - cell "#3" [ref=e122]
              - cell "消失题" [ref=e123]
              - cell "12" [ref=e124]
              - cell "6" [ref=e125]
              - cell "异常" [ref=e126]
            - row [ref=e130]:
              - cell "#4" [ref=e131]
              - cell "消失题" [ref=e132]
              - cell "12" [ref=e133]
              - cell "29" [ref=e134]
              - cell "异常" [ref=e135]
            - row [ref=e139]:
              - cell "#6" [ref=e140]
              - cell "消失题" [ref=e141]
              - cell "12" [ref=e142]
              - cell "5" [ref=e143]
              - cell "异常" [ref=e144]
            - row [ref=e148]:
              - cell "#8" [ref=e149]
              - cell "消失题" [ref=e150]
              - cell "12" [ref=e151]
              - cell "15" [ref=e152]
              - cell "异常" [ref=e153]
            - row [ref=e157]:
              - cell "#10" [ref=e158]
              - cell "消失题" [ref=e159]
              - cell "12" [ref=e160]
              - cell "2" [ref=e161]
              - cell "异常" [ref=e162]
            - row [ref=e166]:
              - cell "#12" [ref=e167]
              - cell "消失题" [ref=e168]
              - cell "12" [ref=e169]
              - cell "97" [ref=e170]
              - cell "异常" [ref=e171]
            - row [ref=e175]:
              - cell "#14" [ref=e176]
              - cell "消失题" [ref=e177]
              - cell "12" [ref=e178]
              - cell "5" [ref=e179]
              - cell "异常" [ref=e180]
            - row [ref=e184]:
              - cell "#16" [ref=e185]
              - cell "消失题" [ref=e186]
              - cell "12" [ref=e187]
              - cell "16" [ref=e188]
              - cell "异常" [ref=e189]
      - generic [ref=e193]:
        - generic [ref=e194]:
          - heading "换一双眼睛" [level=3] [ref=e195]
          - generic [ref=e196]: 第 4 版 · 标准答案 29
        - tablist "色觉视角切换" [ref=e197]:
          - tab "正常视觉" [selected] [ref=e198] [cursor=pointer]
          - tab "红色盲视角" [ref=e199] [cursor=pointer]
          - tab "绿色盲视角" [ref=e200] [cursor=pointer]
          - tab "蓝色盲视角" [ref=e201] [cursor=pointer]
          - tab "全色盲视角" [ref=e202] [cursor=pointer]
        - img "石原氏色觉检测图（消失题）" [ref=e205]
        - paragraph [ref=e206]: 同一张图在不同色觉视角下的样子。切换视角仅供理解色觉差异，不代表你的检测结果。
      - generic [ref=e207]:
        - heading "三轴与日常生活" [level=3] [ref=e208]
        - generic [ref=e209]:
          - button "红色觉" [ref=e211] [cursor=pointer]:
            - generic [aria-hidden] [ref=e215]: 展开 ▼
          - button "绿色觉" [ref=e217] [cursor=pointer]:
            - generic [aria-hidden] [ref=e221]: 展开 ▼
          - button "蓝色觉" [ref=e223] [cursor=pointer]:
            - generic [aria-hidden] [ref=e227]: 展开 ▼
        - paragraph [ref=e228]: 科普内容为普遍性描述，仅供参考，不构成对个人结果的解读。
      - generic [ref=e229]:
        - generic [ref=e230]:
          - button "导出 PNG" [ref=e231] [cursor=pointer]
          - button "打印 / 另存 PDF" [ref=e234] [cursor=pointer]
          - button "复制结果" [ref=e240] [cursor=pointer]
          - button "分享卡 PNG" [ref=e244] [cursor=pointer]
        - generic [ref=e250]:
          - link "重新检测" [ref=e251] [cursor=pointer]:
            - /url: /test
          - link "查看历史" [ref=e254] [cursor=pointer]:
            - /url: /history
      - note [ref=e258]:
        - generic [ref=e262]: 本筛查为教育与自我了解用途，不能替代专业眼科诊断。若日常生活中频繁出现辨色困难，或职业/体检有要求，请前往正规医院眼科进行进一步检查。
  - contentinfo [ref=e263]:
    - generic [ref=e264]:
      - generic [ref=e265]:
        - generic [ref=e266]:
          - strong [ref=e267]: 色辨 ChromaCheck
          - generic [ref=e268]: 在线色觉筛查工具，基于石原氏检测原理。结果仅供参考，不能替代专业眼科诊断。
        - generic [ref=e269]:
          - link "科普文章" [ref=e270] [cursor=pointer]:
            - /url: /learn
          - link "隐私政策" [ref=e271] [cursor=pointer]:
            - /url: /privacy
          - link "ChromaCheck GitHub 仓库" [ref=e272] [cursor=pointer]:
            - /url: https://github.com/sutchan/ChromaCheck
            - text: GitHub
      - generic [ref=e273]: © 2026 ChromaCheck · V1.17.6· build 2611271638 · 仅供教育与筛查用途
  - button "Open Next.js Dev Tools" [ref=e279] [cursor=pointer]
  - alert [ref=e283]: 色辨 ChromaCheck — 在线色觉筛查
```

# Test source

```ts
  1  | // e2e/main-flow.spec.ts — 主链路回归（任务 O-03）
  2  | // chromacheck v1.17.6
  3  | import { expect, test } from '@playwright/test';
  4  | 
  5  | test('首页 → 指引 → 石原氏快速 → 结果', async ({ page }) => {
  6  |   await page.goto('/');
  7  |   await expect(page.locator('#main-content')).toBeVisible();
  8  | 
  9  |   await page.locator('#home-start-cta').click();
  10 |   await expect(page).toHaveURL(/\/guide$/);
  11 | 
  12 |   await page.locator('#guide-start-cta').click();
  13 |   await expect(page).toHaveURL(/\/test$/);
  14 | 
  15 |   await page.locator('#mode-quick-link').click();
  16 |   await expect(page).toHaveURL(/\/test\/ishihara\/quick$/);
  17 | 
  18 |   // 真实流程含演示题反馈、章末过渡与正式答题；按页面状态推进而非按题号硬编码
  19 |   const waitForNextStep = async () => {
> 20 |     await page.waitForFunction(() => {
     |                ^ TimeoutError: page.waitForFunction: Timeout 5000ms exceeded.
  21 |       const input = document.querySelector('#answer') as HTMLInputElement | null;
  22 |       if (input && !input.disabled) return true;
  23 |       const buttons = Array.from(document.querySelectorAll('button'));
  24 |       if (buttons.some((button) => /^(继续|继续检测|完成作答|完成检测)$/.test((button.textContent || '').trim()))) {
  25 |         return true;
  26 |       }
  27 |       return /^\/result\//.test(location.pathname);
  28 |     }, null, { timeout: 5000 });
  29 |   };
  30 | 
  31 |   for (let i = 0; i < 16; i += 1) {
  32 |     if (/\/result\//.test(page.url())) break;
  33 | 
  34 |     const continueButton = page.getByRole('button', { name: /^(继续|继续检测|完成作答|完成检测)$/ }).first();
  35 |     if (await continueButton.isVisible()) {
  36 |       await continueButton.click();
  37 |       await waitForNextStep();
  38 |       continue;
  39 |     }
  40 | 
  41 |     const answer = page.locator('#answer');
  42 |     if (await answer.isVisible() && await answer.isEnabled()) {
  43 |       await answer.fill('12');
  44 |       await page.getByRole('button', { name: /^提交$/ }).first().click();
  45 |       await waitForNextStep();
  46 |       continue;
  47 |     }
  48 | 
  49 |     const unclear = page.getByRole('button', { name: /看不清 \/ 无数字/ }).first();
  50 |     if (await unclear.isVisible()) {
  51 |       await unclear.click();
  52 |       await waitForNextStep();
  53 |     }
  54 |   }
  55 | 
  56 |   await expect(page).toHaveURL(/\/result\//, { timeout: 30000 });
  57 |   await expect(page.locator('#app-footer')).toContainText(/build \d{10}/);
  58 | });
  59 | 
  60 | test('语言切换后 html lang 与所选语言一致（O-02 回归）', async ({ page }) => {
  61 |   await page.goto('/');
  62 |   await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  63 |   await page.getByRole('button', { name: /简体中文|语言|设置/ }).first().click();
  64 |   const tw = page.getByText('繁體中文', { exact: true }).first();
  65 |   if ((await tw.count()) > 0) {
  66 |     await tw.click();
  67 |     await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  68 |   }
  69 | });
  70 | 
```