/* wireframes-catalog-biz.js 前半（自动切分） */
window.__CAT_BIZ_A = [
{
    group: '业务组件', id: 'plate', name: '检测图卡', en: 'IshiharaPlate',
    desc: '核心业务组件。由 Canvas 实时绘制等亮度点阵，不依赖图片资源，因此可在任意色觉模拟下即时重绘。',
    demo:
      '<div class="demo-row" style="gap:24px;align-items:flex-start">' +
      '<div class="plate-frame" style="width:min(300px,70%)"><span class="tag-plate">PLATE 03</span>' +
      '<canvas id="demo-plate-canvas" style="width:100%" aria-label="石原氏检测图示例"></canvas></div>' +
      '<div style="flex:1;min-width:220px"><p class="demo-label">绘制规则</p>' +
      '<ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:var(--fg-soft);display:grid;gap:6px">' +
      '<li>圆形裁切，直径 = 画布 − 6px</li><li>色点半径 9–15px，dart-throwing 无重叠</li>' +
      '<li>图形点与背景点明度一致，只差色相</li><li>同一图版种子固定，重复渲染结果一致</li></ul></div></div>' +
      '<p class="hint" style="margin-top:12px">上例为「转换题」：正常色觉读出 6，红/绿色盲读出 5。</p>',
    spec: [
      ['尺寸', '画布 720px，CSS 显示最大 420px，移动端 62vw'],
      ['题型配色', '演示/常规=蓝点；转换/分类=橙红点；消失=浅橙点；隐藏=近色点'],
      ['动效', '720ms 打散式揭示（<code>cubic-bezier(.22,1,.36,1)</code>）']
    ],
    rules: {
      do: ['加载完成前显示圆形骨架，避免闪烁', '提供「看不清」出口，不强迫作答'],
      dont: ['给检测图加圆角裁切以外的装饰', '在检测过程中显示本题答案']
    },
    a11y: 'canvas 上写 <code>role="img"</code> 与 aria-label；答案输入区提供键盘通路。'
  },
  {
    group: '业务组件', id: 'keypad', name: '答案键盘', en: 'AnswerPad',
    desc: '检测页的主输入区。数字键盘 + 大号等宽答案显示 + 「看不清」出口。',
    demo:
      '<div class="demo-row" style="align-items:flex-start;gap:24px">' +
      '<div style="flex:1;min-width:260px">' +
      '<div class="answer-display" id="demo-answer">74</div>' +
      '<div class="keypad" id="demo-keypad" style="margin-top:12px">' +
      ['1','2','3','4','5','6','7','8','9'].map(function (n) { return '<button class="key" data-k="' + n + '">' + n + '</button>'; }).join('') +
      '<button class="key" data-k="0">0</button><button class="key" data-k="bs">←</button>' +
      '<button class="key key--act" data-k="ok">确认</button>' +
      '<button class="key key--wide" data-k="none">看不清 / 没有数字</button></div></div>' +
      '<div style="flex:0 0 200px;font-size:13px;color:var(--fg-soft)">' +
      '<p class="demo-label">键盘规则</p><ul style="margin:8px 0 0;padding-left:18px;display:grid;gap:6px">' +
      '<li>0–9 输入，最多两位</li><li>Enter 确认并进入下一版</li>' +
      '<li>Backspace 退格</li><li>「看不清」等价于空答案</li></ul></div></div>',
    spec: [
      ['键位', '3×4 网格，键高 56px；底部两键通栏'],
      ['答案显示', '72px 高，40px 等宽数字，空态显示「输入数字」'],
      ['确认键', '品牌实色，最后一版文案改为「提交」']
    ],
    rules: {
      do: ['移动端点开即唤起，无需额外确认', '答完自动进入下一版（可在设置关闭）'],
      dont: ['用系统数字键盘替代（会遮挡检测图）', '限制每题作答时间并倒计时']
    },
    a11y: '每个键都可 Tab 聚焦；答案区用 <code>aria-live</code> 播报当前输入。'
  },
  {
    group: '业务组件', id: 'path-canvas', name: '路径追踪画布', en: 'PathTrackingCanvas',
    desc: '进阶测试。用户在干扰色点中描出连续路径，系统按容差计算与标准路径的重合度。',
    demo:
      '<div class="demo-row" style="align-items:flex-start;gap:20px">' +
      '<div class="path-canvas-wrap" style="flex:1;max-width:420px"><canvas id="demo-path-canvas" style="width:100%"></canvas></div>' +
      '<div style="flex:0 0 200px;font-size:13px;color:var(--fg-soft)">' +
      '<p class="demo-label">判读规则</p><ul style="margin:8px 0 0;padding-left:18px;display:grid;gap:6px">' +
      '<li>重合度 ≥ 70% 判定通过</li><li>30%–70% 为灰区，降低置信度</li>' +
      '<li>&lt; 30% 判定异常</li><li>容差半径 5.5%（归一化坐标）</li></ul></div></div>' +
      '<p class="hint" style="margin-top:12px">试着在上面的画布里描一条线，会实时显示重合度：<b class="mono" id="demo-path-read">0%</b></p>',
    spec: [
      ['画布', '700×520，CSS 宽比 1.35，圆角 14px'],
      ['轨迹', '9px 圆头深色线，绘制在快照层之上，清除即恢复'],
      ['交互', '鼠标与触摸双通道，<code>touch-action: none</code> 防页面滚动']
    ],
    rules: {
      do: ['提供「重画」按钮且不带确认', '支持临时抬笔后继续描'],
      dont: ['限制描线方向或起点', '在未落笔时禁用提交（允许提交空答案）']
    },
    a11y: '提供「无法描线」的文字出口，保证不使用指针也能完成测试。'
  },
  {
    group: '业务组件', id: 'hue-card', name: '色卡', en: 'HueCard',
    desc: 'D15 色相排列的可排序单元。两端参考卡固定，中间 15 张可点击交换。',
    demo:
      '<p class="demo-label">正确顺序（供对照）</p>' +
      '<div class="hue-rail" style="margin-top:8px" id="demo-hue-rail"></div>' +
      '<p class="hint" style="margin-top:10px">移动端同样用点击交换，不依赖拖拽——@dnd-kit 的拖拽只作为桌面端增强。</p>',
    spec: [
      ['尺寸', '62×96，色块 78px 高，编号 11px 等宽'],
      ['状态', '默认 / hover 上浮 4px / 选中（2px 品牌描边）/ 固定（不可点）'],
      ['判读', 'TES &lt; 20 正常，20–40 轻度，&gt; 40 明显异常']
    ],
    rules: {
      do: ['同时支持拖拽与点击交换', '参考卡视觉上明确标注「固定」'],
      dont: ['用色卡顺序之外的信息提示正确答案', '色块上加渐变或阴影（会干扰色相判断）']
    },
    a11y: '色卡编号始终可见，颜色不是唯一信息载体。'
  }
];
