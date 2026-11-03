/* wireframes-catalog-biz.js 后半（自动切分） */
window.__CAT_BIZ_B = [
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
]
];
