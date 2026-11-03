/* wireframes-catalog-base.js 后半（自动切分） */
window.__CAT_BASE_B = [
{
    group: '基础组件', id: 'radio', name: '单选按钮', en: 'Radio',
    desc: '同一组互斥选项，2–4 项时优先于下拉，因为把所有选项摊开更快。',
    demo:
      '<div class="stack" style="gap:10px">' +
      '<label class="radio"><input type="radio" name="m" checked><span class="box"></span><span><b>标准版</b> · 24 题 · 约 3 分钟</span></label>' +
      '<label class="radio"><input type="radio" name="m"><span class="box"></span><span><b>快速版</b> · 10 题 · 约 1 分钟</span></label>' +
      '<label class="radio"><input type="radio" name="m"><span class="box"></span><span><b>进阶版</b> · 24+3+15 · 约 6 分钟</span></label></div>',
    spec: [
      ['尺寸', '20×20 圆形，内点 8px'],
      ['分组', '同组 <code>name</code> 一致，视觉间距 10px']
    ],
    rules: {
      do: ['选项超过 4 项时改用下拉或卡片选择', '把推荐项放第一并标注'],
      dont: ['单选组里放「全都不选」的默认态']
    },
    a11y: '用 fieldset + legend 包裹整组；方向键在组内切换。'
  },
  {
    group: '基础组件', id: 'switch', name: '开关', en: 'Switch',
    desc: '立即生效的设置项，不需要「保存」按钮。',
    demo:
      '<div class="demo-row"><label class="switch"><input type="checkbox" checked><span class="track"></span><span>答题音效</span></label>' +
      '<label class="switch"><input type="checkbox" checked><span class="track"></span><span>答完自动下一题</span></label>' +
      '<label class="switch"><input type="checkbox" data-demo-theme><span class="track"></span><span>深色模式</span></label></div>',
    spec: [
      ['尺寸', '轨道 42×24，滑块 18px，位移 18px'],
      ['动画', '180ms，滑块位移 + 轨道底色同时过渡']
    ],
    rules: {
      do: ['标签写名词（「答题音效」），状态靠开关本身表达', '切换后立刻生效并给出轻提示'],
      dont: ['用开关触发需要二次确认的破坏性操作', '在开关标签里写「开 / 关」字样']
    },
    a11y: '用 <code>role="switch"</code> 或原生 checkbox + <code>aria-checked</code>。'
  },
  {
    group: '基础组件', id: 'chip', name: '标签与状态点', en: 'Chip / StatusDot',
    desc: '结果页的核心信息载体。颜色只是第三重编码，文字与图标始终存在。',
    demo:
      '<div class="demo-row">' +
      '<span class="chip chip--ok"><span class="dot-status"></span>色觉正常</span>' +
      '<span class="chip chip--warn"><span class="dot-status"></span>疑似色弱</span>' +
      '<span class="chip chip--risk"><span class="dot-status"></span>疑似色盲</span>' +
      '<span class="chip chip--brand">推荐</span>' +
      '<span class="chip chip--outline">快速版</span>' +
      '<span class="chip">默认</span></div>',
    spec: [
      ['高度', '24px，圆角全圆，左右内边距 12px'],
      ['语义色', 'ok 青 / warn 琥珀 / risk 砖红 / brand 靛 / outline 中性'],
      ['状态点', '8px 圆点，永远跟随文字而非替代文字']
    ],
    rules: {
      do: ['状态点 + 文字 + 底色三重编码', '深色模式下同步切换到高亮语义色'],
      dont: ['只用一个色点表达结论', '用红色表达「正常」']
    },
    a11y: '语义由相邻文本承载，颜色不参与信息传递；对比度 ≥ 4.5:1。'
  },
  {
    group: '基础组件', id: 'callout', name: '提示条', en: 'Callout',
    desc: '页面内的说明、警告与免责声明。免责声明是全站强制组件。',
    demo:
      '<div class="stack" style="gap:10px">' +
      '<div class="callout callout--info"><span>ⓘ</span><span>进度会自动存在本机，中途关掉页面下次可继续。</span></div>' +
      '<div class="callout callout--warn"><span>⚠</span><span>本工具仅用于色觉筛查参考，<b>不能替代专业医学诊断</b>。</span></div>' +
      '<div class="callout callout--ok"><span>✓</span><span>演示题正确，你可以继续。</span></div>' +
      '<div class="callout"><span>·</span><span>中性说明，用于不具情绪的补充信息。</span></div></div>',
    spec: [
      ['结构', '图标 18px + 文案，内边距 16px，圆角 9px'],
      ['文案', '不超过两行，超过则拆成段落放到正文']
    ],
    rules: {
      do: ['警告类说明「会发生什么 + 该怎么做」', '医疗免责用 warn 且不可关闭'],
      dont: ['用提示条做营销引导', '同一屏堆叠超过两条']
    },
    a11y: '需要打断时加 <code>role="alert"</code>，否则用普通区块 + 可见标题。'
  },
  {
    group: '基础组件', id: 'progress', name: '进度指示', en: 'Progress',
    desc: '两种形态：细长进度条用于阶段，点阵进度用于逐题——一题一点，呼应石原氏点阵图。',
    demo:
      '<div class="stack" style="gap:16px">' +
      '<div><p class="demo-label">BAR · 阶段进度</p><div class="bar-track" style="margin-top:8px"><span class="bar-fill" style="width:62%"></span></div></div>' +
      '<div><p class="demo-label">DOTS · 逐题进度（第 9 / 24 版）</p>' +
      '<div class="pdots" id="demo-pdots" style="margin-top:8px"></div></div>' +
      '<p class="hint">点阵是本产品的签名元素：一题一点，已答为靛蓝，答错为砖红，当前脉冲放大。</p></div>',
    spec: [
      ['条', '高度 4px，圆角全圆，过渡 480ms'],
      ['点', '9px 圆点，间距 5px；当前点放大 1.5 倍并脉冲'],
      ['语义色', '已答 <code>--brand</code>，答错 <code>--risk</code>，未答 <code>--bg-sunken</code>']
    ],
    rules: {
      do: ['点阵数量严格等于题量', '允许点击圆点跳回修改'],
      dont: ['在检测过程中显示「答错」以外的判读信息', '用进度条代替点阵（丢失了「一题一点」的语义）']
    },
    a11y: '整体 <code>role="progressbar"</code> + <code>aria-valuenow</code>；圆点可聚焦并有 title。'
  }
]
];
