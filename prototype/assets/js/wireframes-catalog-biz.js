/* prototype/assets/js/wireframes-catalog-biz.js v0.1.0 — 业务组件目录 */
window.CC_CATALOG = window.CC_CATALOG || [];

var BIZ = [
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
  },
  {
    group: '业务组件', id: 'dim-bar', name: '维度评分条', en: 'DimensionBar',
    desc: '结果页的三轴评分。阈值线把连续分值切成三段，让数字有意义。',
    demo:
      '<div class="card card--pad" style="max-width:460px"><div class="dim-list" id="demo-dims">' +
      [['红色觉', 34, 'var(--axis-protan)'], ['绿色觉', 62, 'var(--axis-deutan)'], ['蓝色觉', 12, 'var(--axis-tritan)']].map(function (d) {
        return '<div class="dim-row"><span class="nm">' + d[0] + '</span><span class="track">' +
          '<span class="fill" style="background:' + d[2] + ';width:' + d[1] + '%"></span>' +
          '<span class="thr" style="left:30%"></span><span class="thr" style="left:60%"></span></span>' +
          '<span class="sc">' + d[1] + '</span></div>';
      }).join('') + '</div>' +
      '<p class="hint" style="margin-top:16px">0–30 正常 · 30–60 轻度偏离 · 60–100 明显偏离</p></div>' +
      '<p class="hint" style="margin-top:10px">顶部「色觉友好配色」开关可把三轴换成蓝—青—琥珀，供红绿色盲用户阅读。</p>',
    spec: [
      ['轨道', '10px 高，圆角全圆，底色 <code>--bg-sunken</code>'],
      ['阈值', '2px 竖线，位于 30% 与 60%'],
      ['动效', '宽度从 0 过渡到目标值，760ms']
    ],
    rules: {
      do: ['数值与进度条同时呈现', '在轴名旁标注通俗含义（如「红色觉」）'],
      dont: ['用红/绿两色作为唯一区分（开启色觉友好配色可规避）', '把评分条做成动画倒计时']
    },
    a11y: '分值以文本形式存在于 DOM。'
  },
  {
    group: '业务组件', id: 'verdict', name: '结论横幅', en: 'VerdictBanner',
    desc: '结果页的第一屏。左侧结论与动作，右侧置信度仪表，左侧 5px 色条编码结论等级。',
    demo:
      '<div class="verdict" style="--verdict-color:var(--warn);padding:32px">' +
      '<div><p class="eyebrow">检测结论 · 标准版</p>' +
      '<h1 style="margin-top:10px;color:var(--warn);font-size:28px">疑似色弱 · 绿色弱</h1>' +
      '<p class="sub">你的答题出现了可识别的异常模式，属于色弱范畴——能分辨颜色，但需要更大的色差。</p>' +
      '<div class="chips" style="margin-top:20px"><span class="chip chip--warn">程度 轻度</span>' +
      '<span class="chip chip--outline">正确 17/24</span><span class="chip chip--outline">用时 3 分 14 秒</span></div></div>' +
      '<div class="gauge" id="demo-gauge"><div style="text-align:center"><div class="val">86</div>' +
      '<div class="lab">置信度</div></div></div></div>' +
      '<p class="hint" style="margin-top:12px">置信度 &lt; 60 时结论横幅下方强制插入橙色提示条，且不给出类型判定。</p>',
    spec: [
      ['结论色', '正常=青 / 疑似色弱=琥珀 / 疑似色盲=砖红 / 不确定=中性灰'],
      ['仪表', '168px 环形，12px 描边，900ms 进度动画'],
      ['动作', '主按钮「导出 PNG / PDF 报告」，次级「重新检测」']
    ],
    rules: {
      do: ['结论文案使用「疑似」，禁止「确诊」「诊断」', '置信度不足时明确说明原因'],
      dont: ['用绿勾表示「正常」以外的语义', '把免责声明折叠起来']
    },
    a11y: '结论等级同时由色条、文字与图标表达。'
  },
  {
    group: '业务组件', id: 'history-row', name: '历史行', en: 'HistoryRow',
    desc: '一行一次检测：时间、结论、三轴迷你柱、置信度、删除。',
    demo:
      '<div class="card">' +
      '<div class="hist-row"><span class="date mono">2026-09-03 20:41</span>' +
      '<span><span class="chip chip--warn"><span class="dot-status"></span>疑似色弱</span> <span class="muted" style="font-size:12px">绿色弱 · 轻度</span></span>' +
      '<span class="muted" style="font-size:13px">标准版</span>' +
      '<span class="row"><span class="spark"><i style="height:9px"></i><i style="height:16px"></i><i class="hi" style="height:4px"></i></span>' +
      '<span class="mono" style="font-size:12px;margin-left:10px">86%</span></span>' +
      '<button class="btn btn--ghost btn--sm">删除</button></div>' +
      '<div class="hist-row"><span class="date mono">2026-06-12 14:27</span>' +
      '<span><span class="chip chip--ok"><span class="dot-status"></span>色觉正常</span></span>' +
      '<span class="muted" style="font-size:13px">快速版</span>' +
      '<span class="row"><span class="spark"><i style="height:5px"></i><i style="height:7px"></i><i style="height:4px"></i></span>' +
      '<span class="mono" style="font-size:12px;margin-left:10px">94%</span></span>' +
      '<button class="btn btn--ghost btn--sm">删除</button></div></div>',
    spec: [
      ['栅格', '92px / 1.2fr / 1fr / 1fr / auto'],
      ['迷你柱', '三根 6px 柱，映射 protan / deutan / tritan'],
      ['容量', '最多 20 条，超出自动删除最旧的']
    ],
    rules: {
      do: ['删除是行内幽灵按钮，危险感最低但不隐藏', '整行可点进入完整结果'],
      dont: ['在历史里保存逐题答案', '删除后不给出撤销']
    },
    a11y: '行内按钮不与整行点击冲突，需用 <code>stopPropagation</code> 并各自可聚焦。'
  },
  {
    group: '业务组件', id: 'report-card', name: '报告卡与免责声明', en: 'ReportCard / Disclaimer',
    desc: '导出版式（A4 纵向）与全站强制的医疗免责声明。导出时隐藏所有交互元素。',
    demo:
      '<div class="demo-row" style="align-items:flex-start;gap:20px">' +
      '<div style="flex:1;min-width:260px;background:#fff;border:1px solid var(--border);border-radius:8px;padding:24px;color:#0e141b">' +
      '<div class="row row--between"><div class="row" style="gap:8px"><span class="logo__dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>' +
      '<b>色辨 ChromaCheck</b></div><span class="mono" style="font-size:11px">cc-2609-014</span></div>' +
      '<hr class="dot-rule" style="margin:16px 0">' +
      '<p style="font-size:11px;color:#5a6675">色觉筛查报告 · 标准版 · 2026-09-03 20:41</p>' +
      '<h3 style="margin-top:8px;color:#b25e00">疑似色弱 · 绿色弱（轻度）</h3>' +
      '<div class="row" style="gap:16px;margin-top:16px">' +
      '<div><p class="mono" style="font-size:20px">62</p><p style="font-size:11px;color:#5a6675">绿色觉</p></div>' +
      '<div><p class="mono" style="font-size:20px">34</p><p style="font-size:11px;color:#5a6675">红色觉</p></div>' +
      '<div><p class="mono" style="font-size:20px">12</p><p style="font-size:11px;color:#5a6675">蓝色觉</p></div>' +
      '<div><p class="mono" style="font-size:20px">86%</p><p style="font-size:11px;color:#5a6675">置信度</p></div></div>' +
      '<p style="margin-top:16px;font-size:11px;color:#5a6675;border-top:1px solid #dee3ea;padding-top:12px">' +
      '本报告仅为筛查参考，不能替代专业医学诊断。结果受屏幕色域、亮度与环境光影响。</p></div>' +
      '<div style="flex:0 0 240px"><p class="demo-label">免责声明（全站强制）</p>' +
      '<div class="callout callout--warn" style="margin-top:8px"><span>⚠</span><span>本工具仅用于色觉筛查参考，' +
      '<b>不能替代专业医学诊断</b>。如结果提示异常，请到正规医院眼科就诊。</span></div>' +
      '<ul style="margin:12px 0 0;padding-left:18px;font-size:13px;color:var(--fg-soft);display:grid;gap:6px">' +
      '<li>首页、检测前、结果页三处必现</li><li>不可关闭、不可折叠</li>' +
      '<li>禁用「确诊 / 诊断 / 治愈」等词</li></ul></div></div>',
    spec: [
      ['导出尺寸', 'A4 纵向 794×1123px，缩放比 2'],
      ['字体', '中文用思源黑体，数字用等宽，保证 PDF 可复制'],
      ['体积', '单份 &lt; 5MB']
    ],
    rules: {
      do: ['导出内容包含检测编号与时间戳', '导出前隐藏按钮与导航'],
      dont: ['导出未脱敏的个人信息', '把免责声明放在报告背面或页脚之外']
    },
    a11y: '报告为静态文档，需保留文本层而非纯图片，便于读屏与检索。'
  }
];

BIZ.forEach(function (c) { CC_CATALOG.push(c); });
