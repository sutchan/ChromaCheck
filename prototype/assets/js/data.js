/* prototype/assets/js/data.js v0.1.0 — 原型真实数据（题库 / 判读规则 / 历史 / 结果 / 科普） */
/* 题库依据石原氏 24 板版式构造，用于原型演示，非临床用图。 */
window.CC = window.CC || {};

/* ---------- 1. 石原氏题库（24 题） ---------- */
CC.questions = [
  { id: 'ishihara-01', plate: 1,  type: 'demonstration',  answer: '12', protan: '12', deutan: '12', difficulty: 1, quick: true },
  { id: 'ishihara-02', plate: 2,  type: 'demonstration',  answer: '8',  protan: '8',  deutan: '8',  difficulty: 1, quick: true },
  { id: 'ishihara-03', plate: 3,  type: 'transformation', answer: '6',  protan: '5',  deutan: '5',  difficulty: 1, quick: true },
  { id: 'ishihara-04', plate: 4,  type: 'transformation', answer: '29', protan: '70', deutan: '70', difficulty: 2, quick: true },
  { id: 'ishihara-05', plate: 5,  type: 'transformation', answer: '57', protan: '35', deutan: '35', difficulty: 2, quick: false },
  { id: 'ishihara-06', plate: 6,  type: 'transformation', answer: '5',  protan: '2',  deutan: '2',  difficulty: 1, quick: true },
  { id: 'ishihara-07', plate: 7,  type: 'transformation', answer: '3',  protan: '5',  deutan: '5',  difficulty: 1, quick: false },
  { id: 'ishihara-08', plate: 8,  type: 'transformation', answer: '15', protan: '17', deutan: '17', difficulty: 2, quick: true },
  { id: 'ishihara-09', plate: 9,  type: 'transformation', answer: '74', protan: '21', deutan: '21', difficulty: 2, quick: false },
  { id: 'ishihara-10', plate: 10, type: 'vanishing',      answer: '2',  protan: '',   deutan: '',   difficulty: 1, quick: true },
  { id: 'ishihara-11', plate: 11, type: 'vanishing',      answer: '6',  protan: '',   deutan: '',   difficulty: 1, quick: false },
  { id: 'ishihara-12', plate: 12, type: 'vanishing',      answer: '97', protan: '',   deutan: '',   difficulty: 2, quick: true },
  { id: 'ishihara-13', plate: 13, type: 'vanishing',      answer: '45', protan: '',   deutan: '',   difficulty: 2, quick: false },
  { id: 'ishihara-14', plate: 14, type: 'vanishing',      answer: '5',  protan: '',   deutan: '',   difficulty: 1, quick: true },
  { id: 'ishihara-15', plate: 15, type: 'vanishing',      answer: '7',  protan: '',   deutan: '',   difficulty: 1, quick: false },
  { id: 'ishihara-16', plate: 16, type: 'vanishing',      answer: '16', protan: '',   deutan: '',   difficulty: 2, quick: true },
  { id: 'ishihara-17', plate: 17, type: 'hidden',         answer: '',   protan: '73', deutan: '73', difficulty: 3, quick: false },
  { id: 'ishihara-18', plate: 18, type: 'classification', answer: '26', protan: '6',  deutan: '2',  difficulty: 3, quick: false },
  { id: 'ishihara-19', plate: 19, type: 'classification', answer: '42', protan: '2',  deutan: '4',  difficulty: 3, quick: false },
  { id: 'ishihara-20', plate: 20, type: 'classification', answer: '35', protan: '5',  deutan: '3',  difficulty: 3, quick: false },
  { id: 'ishihara-21', plate: 21, type: 'classification', answer: '96', protan: '6',  deutan: '9',  difficulty: 3, quick: false },
  { id: 'ishihara-22', plate: 22, type: 'transformation', answer: '8',  protan: '3',  deutan: '3',  difficulty: 2, quick: false },
  { id: 'ishihara-23', plate: 23, type: 'normal',         answer: '2',  protan: '2',  deutan: '2',  difficulty: 1, quick: false },
  { id: 'ishihara-24', plate: 24, type: 'normal',         answer: '5',  protan: '5',  deutan: '5',  difficulty: 1, quick: false }
];

CC.typeLabel = {
  demonstration: '演示题', normal: '常规题', transformation: '转换题',
  vanishing: '消失题', hidden: '隐藏题', classification: '分类题'
};

/* ---------- 2. 判读规则（对应 DATA-SPEC §7.1） ---------- */
CC.rules = {
  confidence: { base: 100, demoWrong: -25, tooFast: -2, contradiction: -15, lowCoverage: -20, min: 0 },
  vanishing: { mild: 2, blind: 4 },
  severity: { severeRate: 0.7, moderateRate: 0.4 },
  dimension: { normal: 30, mild: 60 },
  tes: { normal: 20, mild: 40 },
  pathOverlap: { pass: 70, fail: 30 }
};

/* ---------- 3. 演示用历史记录（真实结构） ---------- */
CC.history = [
  { id: 'cc-2609-014', date: '2026-09-03T20:41:00+08:00', mode: 'standard', overall: 'suspected_deficiency', type: 'deuteranomaly', severity: 'mild', confidence: 86, dims: [34, 62, 12] },
  { id: 'cc-2608-013', date: '2026-08-19T09:12:00+08:00', mode: 'standard', overall: 'suspected_deficiency', type: 'deuteranomaly', severity: 'mild', confidence: 79, dims: [30, 58, 15] },
  { id: 'cc-2607-012', date: '2026-07-06T21:03:00+08:00', mode: 'quick',    overall: 'suspected_deficiency', type: 'deuteranomaly', severity: 'mild', confidence: 72, dims: [28, 55, 18] },
  { id: 'cc-2606-011', date: '2026-06-12T14:27:00+08:00', mode: 'quick',    overall: 'normal',               type: null,            severity: null,   confidence: 94, dims: [12, 18,  9] },
  { id: 'cc-2605-010', date: '2026-05-02T11:08:00+08:00', mode: 'advanced', overall: 'normal',               type: null,            severity: null,   confidence: 91, dims: [16, 22, 11] },
  { id: 'cc-2604-009', date: '2026-04-15T19:55:00+08:00', mode: 'standard', overall: 'inconclusive',         type: null,            severity: null,   confidence: 48, dims: [40, 44, 30] }
];

CC.overallLabel = {
  normal: '色觉正常', suspected_deficiency: '疑似色弱',
  suspected_blindness: '疑似色盲', inconclusive: '结果不确定'
};
CC.typeText = {
  protanopia: '红色盲', protanomaly: '红色弱', deuteranopia: '绿色盲',
  deuteranomaly: '绿色弱', tritanopia: '蓝色盲', tritanomaly: '蓝色弱', achromatopsia: '全色盲'
};
CC.severityText = { mild: '轻度', moderate: '中度', severe: '重度' };
CC.modeText = { quick: '快速版', standard: '标准版', advanced: '进阶版' };

/* ---------- 4. 演示用完整结果（结果页默认展示） ---------- */
CC.demoResult = {
  id: 'cc-2609-014',
  mode: 'standard',
  startTime: '2026-09-03T20:38:12+08:00',
  endTime: '2026-09-03T20:41:26+08:00',
  device: 'Windows · Chrome 128 · 1920×1080',
  ishihara: {
    overall: 'suspected_deficiency', type: 'deuteranomaly', severity: 'mild', confidence: 86,
    dimensions: { protan: 34, deutan: 62, tritan: 12 },
    details: { correctCount: 17, totalCount: 24, errorPatterns: [
      { type: 'deutan', questionCount: 5, description: '转换题中 5 题答案与绿色弱典型答案一致' },
      { type: 'mixed',  questionCount: 2, description: '消失题未见数字，与绿色觉异常表现一致' }
    ] }
  },
  pathTracking: [
    { questionId: 'path-01', overlapScore: 78, passed: true,  target: 'deutan' },
    { questionId: 'path-02', overlapScore: 64, passed: false, target: 'protan' },
    { questionId: 'path-03', overlapScore: 71, passed: true,  target: 'deutan' }
  ],
  hueArrangement: { totalErrorScore: 26, deviationDirection: 'deutan', normal: false, cardErrors: [0,1,2,3,0,4,2,1,0,2,3,1,0,2,1] }
};

/* 逐题明细（24 题，含用时，演示真实答题过程） */
CC.demoAnswers = [
  ['ishihara-01','12',1],['ishihara-02','8',1],['ishihara-03','5',0],['ishihara-04','29',1],
  ['ishihara-05','35',0],['ishihara-06','5',1],['ishihara-07','3',1],['ishihara-08','17',0],
  ['ishihara-09','74',1],['ishihara-10','2',1],['ishihara-11','',0],['ishihara-12','97',1],
  ['ishihara-13','45',1],['ishihara-14','5',1],['ishihara-15','7',1],['ishihara-16','16',1],
  ['ishihara-17','',1],['ishihara-18','2',0],['ishihara-19','4',0],['ishihara-20','35',1],
  ['ishihara-21','96',1],['ishihara-22','3',0],['ishihara-23','2',1],['ishihara-24','5',1]
].map(function (r, i) {
  return { questionId: r[0], userAnswer: r[1], correct: !!r[2], durationMs: [2100,3400,7800,2600,6900,1900,2200,5400,3100,4300,9100,3800,5200,2600,2100,4700,6600,8400,7300,2900,4000,6100,1700,1800][i] };
});

/* ---------- 5. 色相排列色卡（Farnsworth-Munsell D15 sRGB 近似） ---------- */
CC.hueCards = [
  '#7b6ea8', '#6a7fc4', '#4f97c9', '#3fa8b8', '#49b295', '#5fb369', '#87ad4c',
  '#b3a33f', '#c9903c', '#cf7442', '#c95f52', '#bb5566', '#a95f87', '#9568a4', '#8474ae'
];
CC.hueShuffled = [7, 3, 11, 1, 14, 9, 5, 0, 13, 6, 2, 12, 8, 4, 10];

/* ---------- 6. 科普文章 ---------- */
CC.articles = [
  { slug: 'what-is-color-blindness', title: '色盲和色弱，其实不是一回事', cat: '基础知识', read: '6 分钟', hue: '#6a7fc4', excerpt: '色盲是某类视锥细胞缺失，色弱是功能减弱。两者的成因、表现与生活影响差别很大。' },
  { slug: 'ishihara-principle',     title: '石原氏检测图是怎么"骗过"眼睛的', cat: '检测原理', read: '8 分钟', hue: '#c9903c', excerpt: '同样大小、同样明暗的色点，只靠色相差异构成数字——这是等亮度设计的巧思。' },
  { slug: 'inheritance',            title: '色觉异常会遗传吗？一张图看懂规律', cat: '遗传规律', read: '5 分钟', hue: '#49b295', excerpt: '红绿色觉异常属于 X 连锁隐性遗传，男性患病率约为女性的 16 倍。' },
  { slug: 'career-limits',          title: '哪些专业和职业对色觉有明确要求', cat: '职业相关', read: '7 分钟', hue: '#bb5566', excerpt: '梳理高考体检、驾驶证申领与部分行业的色觉要求，附官方文件依据。' },
  { slug: 'daily-tips',             title: '色觉异常者的 12 个生活小技巧',   cat: '生活贴士', read: '5 分钟', hue: '#3fa8b8', excerpt: '从挑衣服到读图表，用标签、明度和位置替代色相，可以解决大部分困扰。' },
  { slug: 'when-to-see-doctor',     title: '什么情况需要去医院做专业检查',   cat: '就医指南', read: '4 分钟', hue: '#87ad4c', excerpt: '在线筛查只是第一步，出现这些信号建议尽快到眼科做进一步检查。' }
];

/* ---------- 7. 页面清单（供 flow.html 使用） ---------- */
CC.routes = [
  { key: 'home',        label: '首页',        group: '入口' },
  { key: 'guide',       label: '检测前指引',   group: '检测' },
  { key: 'select',      label: '模式选择',     group: '检测' },
  { key: 'ishihara',    label: '石原氏测试',   group: '检测' },
  { key: 'path',        label: '路径追踪',     group: '检测' },
  { key: 'hue',         label: '色相排列',     group: '检测' },
  { key: 'result',      label: '结果页',       group: '结果' },
  { key: 'history',     label: '历史记录',     group: '结果' },
  { key: 'learn',       label: '科普列表',     group: '科普' },
  { key: 'learnDetail', label: '科普详情',     group: '科普' }
];
