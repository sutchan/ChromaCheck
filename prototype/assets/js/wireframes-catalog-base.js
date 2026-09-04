/* prototype/assets/js/wireframes-catalog-base.js v0.1.0 — 基础组件目录 */
window.CC_CATALOG = window.CC_CATALOG || [];

var BASE = [
  {
    group: '基础组件', id: 'button', name: '按钮', en: 'Button',
    desc: '触发一个明确动作。一个界面里只能有一个主按钮，其余降级为次级或幽灵按钮。',
    demo:
      '<div class="demo-row"><button class="btn btn--primary">开始检测</button>' +
      '<button class="btn btn--secondary">导出报告</button>' +
      '<button class="btn btn--ghost">取消</button>' +
      '<button class="btn btn--danger">清空记录</button>' +
      '<button class="btn btn--primary" disabled>已禁用</button></div>' +
      '<div class="demo-row"><button class="btn btn--primary btn--lg">大号 50px</button>' +
      '<button class="btn btn--secondary">默认 40px</button>' +
      '<button class="btn btn--secondary btn--sm">小号 32px</button>' +
      '<button class="btn btn--primary btn--block" style="max-width:280px">通栏按钮</button></div>',
    spec: [
      ['主按钮 <code>.btn--primary</code>', '每屏最多一个，承载用户最可能做的那件事。'],
      ['次级 <code>.btn--secondary</code>', '并列动作，如「导出报告」「重新检测」。'],
      ['幽灵 <code>.btn--ghost</code>', '返回、取消等低优先级动作。'],
      ['危险 <code>.btn--danger</code>', '不可逆操作，需二次确认。'],
      ['尺寸', '<code>sm 32 / md 40 / lg 50</code>，圆角固定 5px。'],
      ['状态', 'default / hover(上浮 1px) / active / focus(3px 光环) / disabled(45% 透明)']
    ],
    rules: {
      do: ['文案写动作结果，如「导出报告」而不是「提交」', '同一动作在全流程用同一个名字', '危险操作前先给确认弹窗'],
      dont: ['一屏放两个主按钮', '用颜色单独表达语义（必须配文字）', '禁用按钮却不说明为什么不能点']
    },
    a11y: '使用原生 <b>&lt;button&gt;</b>；禁用态同时设置 <code>disabled</code> 与 <code>aria-disabled</code>；焦点环 3px 且对比度 ≥ 3:1。'
  },
  {
    group: '基础组件', id: 'icon-button', name: '图标按钮', en: 'IconButton',
    desc: '40×40 方形按钮，用于工具栏与关闭/返回。必须带 aria-label。',
    demo:
      '<div class="demo-row">' +
      '<button class="btn btn--icon" aria-label="关闭">✕</button>' +
      '<button class="btn btn--icon btn--secondary" aria-label="返回上一版">←</button>' +
      '<button class="btn btn--icon btn--ghost btn--sm" aria-label="设置">⚙</button>' +
      '<button class="btn btn--icon" aria-label="播放音效" data-demo-toggle>♪</button></div>',
    spec: [
      ['尺寸', '<code>40×40</code>（<code>.btn--sm</code> 为 32×32）'],
      ['图标', '18px 线性，描边 1.5，不使用填充图标'],
      ['选中态', '加 <code>.is-on</code>，底色转品牌色']
    ],
    rules: {
      do: ['始终提供 aria-label 与 title', '同一工具栏内尺寸保持一致'],
      dont: ['用纯图形表达复杂操作', '把两个动作塞进一个图标按钮']
    },
    a11y: '键盘可 Tab 到，Enter / Space 触发；触摸目标不小于 40×40。'
  },
  {
    group: '基础组件', id: 'input', name: '输入框', en: 'Input',
    desc: '文本与数字录入。本产品的答案输入是大号等宽居中，因为输入的是「数字」而不是「文字」。',
    demo:
      '<div class="demo-row" style="align-items:flex-start">' +
      '<div style="flex:1;min-width:220px"><label class="field"><span class="label">昵称 <span class="req">*</span></span>' +
      '<input class="input" placeholder="选填，用于报告署名"><span class="hint">不会上传，只存在本机。</span></label></div>' +
      '<div style="flex:1;min-width:220px"><label class="field"><span class="label">年龄</span>' +
      '<input class="input is-invalid" value="abc"><span class="err">⚠ 请输入 1–120 之间的数字</span></label></div></div>' +
      '<div class="demo-row"><input class="input input--lg" style="max-width:220px" value="74" aria-label="答案输入"></div>',
    spec: [
      ['高度', '默认 40px；答案输入 56px（<code>.input--lg</code>）'],
      ['校验', '错误时边框转 <code>--risk</code> + 下方 12px 说明，不只用红色'],
      ['提示', '<code>.hint</code> 常态说明，<code>.err</code> 错误说明，二者不同时出现']
    ],
    rules: {
      do: ['错误文案说明「怎么改」而不是「错了」', '答案输入用等宽 + tabular-nums'],
      dont: ['用 placeholder 代替 label', '只靠红色边框表达错误']
    },
    a11y: 'label 用 <code>for</code> 绑定；错误时 <code>aria-invalid="true"</code> + <code>aria-describedby</code> 指向说明。'
  },
  {
    group: '基础组件', id: 'select', name: '选择器与文本域', en: 'Select / Textarea',
    desc: '下拉用于 3 项以上的枚举；文本域仅在「意见反馈」出现。',
    demo:
      '<div class="demo-row" style="align-items:flex-start">' +
      '<div style="flex:1;min-width:220px"><label class="field"><span class="label">检测模式</span>' +
      '<select class="select"><option>标准版 24 题（推荐）</option><option>快速版 10 题</option><option>进阶版 含 D15</option></select></label></div>' +
      '<div style="flex:1;min-width:260px"><label class="field"><span class="label">反馈</span>' +
      '<textarea class="textarea" placeholder="哪一步让你困惑？"></textarea></label></div></div>',
    spec: [
      ['高度', 'select 40px，与按钮对齐；textarea 最小 88px 可纵向拉伸'],
      ['选项', '默认选中推荐项，不在首行放「请选择」占位']
    ],
    rules: {
      do: ['选项按使用频率排序', '少于 3 项改用单选按钮'],
      dont: ['用下拉承载超过 20 项的选择', '把危险操作藏在下拉里']
    },
    a11y: '原生 <code>&lt;select&gt;</code> 以保证移动端与读屏体验。'
  },
  {
    group: '基础组件', id: 'checkbox', name: '复选框', en: 'Checkbox',
    desc: '用于确认类条款，例如「我已了解检测要求」。勾选后主按钮才可点。',
    demo:
      '<div class="demo-row"><label class="check"><input type="checkbox" checked><span class="box"></span>' +
      '<span>我已了解以上要求，并确认当前环境符合检测条件。</span></label></div>' +
      '<div class="demo-row"><label class="check"><input type="checkbox"><span class="box"></span><span>记住我的选择</span></label>' +
      '<label class="check"><input type="checkbox" disabled><span class="box"></span><span class="muted">不可用</span></label></div>',
    spec: [
      ['尺寸', '20×20 方框，圆角 3px，勾选线 2px'],
      ['点击区', '整行文案都可点击（label 包裹）'],
      ['不确定态', '半选仅用于「全选」，普通表单不用']
    ],
    rules: {
      do: ['文案写成用户承诺的完整句子', '必勾项在按钮禁用时保持可见并说明原因'],
      dont: ['用复选框做「开关」语义（要用 Switch）', '默认勾选协议类条款']
    },
    a11y: '原生 input + 视觉替换；焦点环落在外框上。'
  },
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
];

BASE.forEach(function (c) { CC_CATALOG.push(c); });
