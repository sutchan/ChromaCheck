/* prototype/assets/js/wireframes-catalog-comp.js v0.1.0 — 复合组件目录 */
window.CC_CATALOG = window.CC_CATALOG || [];

var COMP = [
  {
    group: '复合组件', id: 'card', name: '卡片', en: 'Card',
    desc: '内容分组的基本容器。三种密度：信息卡（无内边距 + 头尾分区）、内容卡（24px 内边距）、可点卡（hover 上浮）。',
    demo:
      '<div class="grid grid-3">' +
      '<div class="card"><div class="card-head"><strong>全部记录</strong><span class="chip chip--outline">6 条</span></div>' +
      '<div class="card-body"><p class="muted" style="font-size:13px">头尾分区型，用于承载列表与明细。</p></div></div>' +
      '<div class="card card--pad"><p class="eyebrow">人群基线</p><div class="row row--between" style="margin-top:14px">' +
      '<div class="stat"><span class="stat__num">8%</span><span class="stat__label">男性</span></div>' +
      '<div class="stat"><span class="stat__num">0.5%</span><span class="stat__label">女性</span></div></div></div>' +
      '<div class="card card--pad card--hover" style="cursor:pointer"><h4>可点卡片</h4>' +
      '<p class="muted" style="margin-top:8px;font-size:13px">hover 上浮 3px 并加深阴影。</p></div></div>',
    spec: [
      ['圆角 / 描边', '14px / 1px <code>--border</code>，阴影 <code>--sh-1</code>'],
      ['分区', '<code>.card-head</code> 56px 高并带下边线，<code>.card-body</code> 24px 内边距'],
      ['可点态', '整卡可点时加 <code>.card--hover</code>，光标 pointer']
    ],
    rules: {
      do: ['一张卡只讲一件事', '卡片内标题层级不超过 h4'],
      dont: ['卡片套卡片', '用卡片边框表达状态（用 chip）']
    },
    a11y: '整卡可点时，卡内需有一个真实可聚焦元素（按钮或链接），不要给 div 直接绑 click。'
  },
  {
    group: '复合组件', id: 'form', name: '表单', en: 'Form',
    desc: '标签在上、控件在下，垂直间距 20px。校验即时触发但不打断输入。',
    demo:
      '<form style="max-width:420px;display:grid;gap:20px" onsubmit="return false">' +
      '<label class="field"><span class="label">报告署名 <span class="req">*</span></span>' +
      '<input class="input" value="小明"><span class="hint">会印在导出报告的右上角。</span></label>' +
      '<label class="field"><span class="label">检测日期</span>' +
      '<input class="input is-invalid" value="2026/09/03 20:41"><span class="err">⚠ 日期格式应为 YYYY-MM-DD</span></label>' +
      '<div class="field"><span class="label">提醒方式</span>' +
      '<label class="radio"><input type="radio" name="f" checked><span class="box"></span><span>不提醒</span></label></div>' +
      '<div class="row" style="gap:10px"><button class="btn btn--primary">保存</button>' +
      '<button class="btn btn--ghost">取消</button></div></form>',
    spec: [
      ['间距', '字段之间 20px，标签与控件 8px'],
      ['必填', '标签后红色星号，同时写 <code>aria-required</code>'],
      ['错误', '失焦即校验，输入过程中不移除错误样式直到改对']
    ],
    rules: {
      do: ['提交按钮放在表单左下或右下，与取消同级', '错误汇总放在提交按钮上方（超过 3 个错误时）'],
      dont: ['把错误信息放在 tooltip 里', '提交失败后清空用户已填内容']
    },
    a11y: 'Enter 提交；错误字段按顺序获得焦点；错误文案可被读屏关联。'
  },
  {
    group: '复合组件', id: 'modal', name: '模态框', en: 'Modal',
    desc: '打断式操作，只用于不可逆动作或必须立即决策的场景。',
    demo:
      '<div class="demo-row"><button class="btn btn--danger" data-demo-modal>清空全部历史记录</button>' +
      '<p class="muted" style="font-size:13px">点击体验：遮罩 + 弹入动画 + 焦点锁在弹窗内。</p></div>',
    spec: [
      ['宽度', '440px，圆角 14px，阴影 <code>--sh-3</code>'],
      ['遮罩', '55% 黑 + 3px 模糊，点击遮罩关闭'],
      ['按钮', '主按钮在右，危险动作主按钮用 <code>.btn--danger</code>']
    ],
    rules: {
      do: ['标题直接写后果，如「清空后无法恢复」', '关闭方式三种：取消按钮 / Esc / 点遮罩'],
      dont: ['弹窗里再开弹窗', '用弹窗承载多步骤流程（改用独立页面）']
    },
    a11y: '<code>role="dialog" aria-modal="true"</code>，打开时焦点移入，关闭后归还给触发元素。'
  },
  {
    group: '复合组件', id: 'toast', name: '轻提示', en: 'Toast',
    desc: '非打断反馈，右下角堆叠，2.4 秒后自动消失。',
    demo:
      '<div class="demo-row"><button class="btn btn--secondary" data-demo-toast>触发一条轻提示</button>' +
      '<span class="hint">最多同时 3 条，超出后最早的先消失。</span></div>',
    spec: [
      ['位置', '右下角 24px，宽度 260–380px'],
      ['动效', '上浮 14px 淡入 280ms，消失前下移 6px 淡出']
    ],
    rules: {
      do: ['文案与动作同名：点了「导出」就提示「已导出」', '一次只说一件事'],
      dont: ['用轻提示报错（错误要留在页面上）', '需要用户操作时用它']
    },
    a11y: '容器 <code>aria-live="polite"</code>，不抢夺焦点。'
  },
  {
    group: '复合组件', id: 'empty', name: '空状态', en: 'Empty',
    desc: '空状态是一次邀请，不是一句抱歉。必须给出下一步动作。',
    demo:
      '<div class="card"><div class="empty">' +
      '<div class="empty__art"><div class="logo__dots" style="transform:scale(3);margin:0 auto 24px;width:24px">' +
      '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +
      '<strong>还没有检测记录</strong><p style="font-size:13px">完成第一次检测后，结果会出现在这里。</p>' +
      '<button class="btn btn--primary" data-go="guide">开始第一次检测</button></div></div>',
    spec: [
      ['结构', '图形 → 标题 → 一句说明 → 一个主按钮'],
      ['内边距', '上下 72px，居中对齐']
    ],
    rules: {
      do: ['说明「为什么是空的」和「下一步做什么」', '加载中用骨架屏而不是空状态'],
      dont: ['空状态里放两个以上按钮', '只写「暂无数据」']
    },
    a11y: '空状态标题用真实标题标签，读屏能定位。'
  },
  {
    group: '复合组件', id: 'table', name: '表格', en: 'Table',
    desc: '用于逐题明细与历史记录。数字列右对齐并等宽，避免跳动。',
    demo:
      '<div class="card"><table class="table"><thead><tr><th>图版</th><th>题型</th><th class="num">你的答案</th>' +
      '<th class="num">用时</th><th>判定</th></tr></thead><tbody>' +
      '<tr><td class="mono">No.01</td><td>演示题</td><td class="num">12</td><td class="num">2.1s</td><td><span class="chip chip--ok">正确</span></td></tr>' +
      '<tr><td class="mono">No.03</td><td>转换题</td><td class="num">5</td><td class="num">7.8s</td><td><span class="chip chip--warn">绿轴</span></td></tr>' +
      '<tr><td class="mono">No.11</td><td>消失题</td><td class="num">——</td><td class="num">9.1s</td><td><span class="chip chip--risk">未读出</span></td></tr>' +
      '</tbody></table></div>',
    spec: [
      ['行高', '单元格内边距 12px 16px，行分隔线 1px'],
      ['数字列', '<code>.num</code> 右对齐 + 等宽数字'],
      ['悬浮', '整行底色转 <code>--bg-sunken</code>']
    ],
    rules: {
      do: ['超过 8 行用表格，少于 8 行可用卡片网格', '行内操作不超过两个'],
      dont: ['在检测过程中展示判定列（会泄露答案）', '用斑马纹替代分隔线']
    },
    a11y: '用 <code>&lt;th scope="col"&gt;</code>；行操作按钮带完整 aria-label。'
  },
  {
    group: '复合组件', id: 'tabs', name: '标签页', en: 'Tabs',
    desc: '在同一区域内切换并列内容，不下钻新页面。',
    demo:
      '<div class="demo-row" style="gap:0;border-bottom:1px solid var(--border);width:100%" id="demo-tabs">' +
      '<button class="btn btn--ghost" data-tab="a" style="border-bottom:2px solid var(--brand);border-radius:0">结果总览</button>' +
      '<button class="btn btn--ghost" data-tab="b" style="border-radius:0">逐题明细</button>' +
      '<button class="btn btn--ghost" data-tab="c" style="border-radius:0">生活建议</button></div>' +
      '<p class="muted" style="font-size:13px;margin-top:12px">切换后内容区高度保持稳定，避免页面跳动。</p>',
    spec: [
      ['指示器', '2px 底部实线，颜色 <code>--brand</code>'],
      ['数量', '2–5 个，超过则改用下拉或侧边导航']
    ],
    rules: {
      do: ['标签名是名词短语，控制在 6 字内', '记住用户上次选中的标签'],
      dont: ['用标签页做步骤流程（用 Stepper）', '标签内嵌套滚动容器']
    },
    a11y: '<code>role="tablist"</code> + 左右方向键切换 + <code>aria-selected</code>。'
  },
  {
    group: '复合组件', id: 'stepper', name: '步骤条', en: 'Stepper',
    desc: '表达有序流程。序号是真实进度，不是装饰——只有流程确实有顺序时才用。',
    demo:
      '<div class="flow-3">' +
      '<div class="step"><h4>校准观看环境</h4><p>确认屏幕亮度、观看距离与室内光线。</p></div>' +
      '<div class="step"><h4>读完 24 版检测图</h4><p>读出数字，或选择「看不清」。</p></div>' +
      '<div class="step"><h4>读取色觉画像</h4><p>类型、程度、置信度与逐题明细。</p></div></div>',
    spec: [
      ['序号', '28px 圆形，品牌底色，压在 2px 顶线上'],
      ['当前步', '未达步骤的顶线与序号保持中性灰'],
      ['文案', '标题 ≤ 12 字，说明 ≤ 30 字']
    ],
    rules: {
      do: ['步骤数与实际流程一致（本产品是 3 步）', '允许回退到已完成步骤'],
      dont: ['给并列内容编序号', '步骤超过 5 个还横排']
    },
    a11y: '用有序列表 <code>&lt;ol&gt;</code> 承载，读屏可播报「第 2 步，共 3 步」。'
  }
];

COMP.forEach(function (c) { CC_CATALOG.push(c); });
