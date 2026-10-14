// lib/i18n.ts — 轻量双语字典（zh / en，零依赖，C6 国际化第一步）
// chromacheck v1.8.0

export type Lang = 'zh' | 'en';

export const LANGS: Lang[] = ['zh', 'en'];
export const DEFAULT_LANG: Lang = 'zh';
export const LANG_STORAGE_KEY = 'cc.lang.v1';

export const LANG_LABEL: Record<Lang, string> = { zh: '中文', en: 'EN' };

/** 字典键：点号分隔，新增文案时同步补充 zh / en 两份 */
export type DictKey =
  | 'nav.home'
  | 'nav.test'
  | 'nav.history'
  | 'nav.lang'
  | 'home.chip'
  | 'home.title'
  | 'home.desc'
  | 'home.ctaStart'
  | 'home.ctaLearn'
  | 'home.disclaimer'
  | 'home.whyTitle'
  | 'home.stepsTitle'
  | 'feat.science.title'
  | 'feat.science.text'
  | 'feat.quick.title'
  | 'feat.quick.text'
  | 'feat.dims.title'
  | 'feat.dims.text'
  | 'feat.privacy.title'
  | 'feat.privacy.text'
  | 'step1.title'
  | 'step1.text'
  | 'step2.title'
  | 'step2.text'
  | 'step3.title'
  | 'step3.text'
  | 'select.chip'
  | 'select.title'
  | 'select.desc'
  | 'select.guideCallout'
  | 'mode.quick.title'
  | 'mode.quick.desc'
  | 'mode.quick.meta'
  | 'mode.standard.title'
  | 'mode.standard.desc'
  | 'mode.standard.meta'
  | 'mode.path.title'
  | 'mode.path.desc'
  | 'mode.path.meta'
  | 'mode.hue.title'
  | 'mode.hue.desc'
  | 'mode.hue.meta'
  | 'mode.advanced.title'
  | 'mode.advanced.desc'
  | 'mode.advanced.meta'
  | 'mode.child.title'
  | 'mode.child.desc'
  | 'mode.child.meta'
  | 'driver.title'
  | 'driver.desc'
  | 'driver.standard'
  | 'driver.standardDesc'
  | 'driver.signal'
  | 'driver.signalDesc'
  | 'child.chip'
  | 'child.title'
  | 'child.desc'
  | 'child.progress'
  | 'child.demo'
  | 'child.pickShape'
  | 'child.optionsLabel'
  | 'child.noShape'
  | 'child.saving'
  | 'child.callout'
  | 'common.analysisNote'
  | 'profile.all'
  | 'profile.switch'
  | 'profile.manage'
  | 'profile.add'
  | 'profile.name'
  | 'profile.relation'
  | 'profile.avatar'
  | 'profile.rename'
  | 'profile.delete'
  | 'profile.deleteConfirm'
  | 'profile.current'
  | 'history.export'
  | 'history.import'
  | 'history.exportSummary'
  | 'history.importError'
  | 'history.importDone'
  | 'batch.title'
  | 'batch.desc'
  | 'batch.names'
  | 'batch.start'
  | 'batch.goTest'
  | 'batch.done'
  | 'batch.pending'
  | 'batch.none'
  | 'batch.summary'
  | 'batch.hint'
  | 'batch.meta';

type Dict = Record<DictKey, string>;

const ZH: Dict = {
  'nav.home': '首页',
  'nav.test': '开始检测',
  'nav.history': '历史',
  'nav.lang': '语言',
  'home.chip': '在线色觉筛查 · 石原氏原理',
  'home.title': '看清世界的色彩，从一次自测开始',
  'home.desc': '色辨 ChromaCheck 帮你在家快速了解自己的色觉状况：是正常、色弱还是色盲倾向，以及偏向红绿还是蓝黄。',
  'home.ctaStart': '开始检测',
  'home.ctaLearn': '了解色觉知识',
  'home.disclaimer': '本工具为筛查用途，不能替代专业眼科诊断。',
  'home.whyTitle': '为什么用色辨',
  'home.stepsTitle': '三步完成',
  'feat.science.title': '科学原理',
  'feat.science.text': '基于石原氏等亮度检测图，仅靠色相差异构成数字，能分辨红绿与蓝黄异常。',
  'feat.quick.title': '快速筛查',
  'feat.quick.text': '快速版 10 题约 3 分钟，标准版 38 题约 12 分钟，随时在浏览器完成。',
  'feat.dims.title': '维度分析',
  'feat.dims.text': '输出红 / 绿 / 蓝三轴异常倾向与置信度，比“通过 / 不通过”更有信息量。',
  'feat.privacy.title': '隐私优先',
  'feat.privacy.text': '检测数据与历史仅存于本机浏览器，不上传服务器，可随时查看与删除。',
  'step1.title': '选择模式',
  'step1.text': '快速版或标准版，按需自测。',
  'step2.title': '看图作答',
  'step2.text': '说出图中数字，凭直觉、不猜测。',
  'step3.title': '查看判读',
  'step3.text': '即时生成结论、维度图与明细。',
  'select.chip': '开始检测',
  'select.title': '选择检测模式',
  'select.desc': '两种石原氏模式均为纯本地检测，结果仅保存在你的浏览器。建议先做快速版，如需更稳妥的结论再做标准版。',
  'select.guideCallout': '检测前请阅读',
  'mode.quick.title': '快速版',
  'mode.quick.desc': '10 道核心题目，3 分钟左右，适合初次自测与定期复检。',
  'mode.quick.meta': '约 3 分钟 · 10 题',
  'mode.standard.title': '标准版',
  'mode.standard.desc': '完整 38 题，覆盖转换、消失、隐藏与分类题型，结果更稳定。',
  'mode.standard.meta': '约 12 分钟 · 38 题',
  'mode.path.title': '路径追踪',
  'mode.path.desc': '沿嵌入色点连成的路径描线，辅助判断红/绿色觉异常（v1.1 新增）。',
  'mode.path.meta': '约 2 分钟 · 描线',
  'mode.hue.title': '色相排列',
  'mode.hue.desc': '将 15 张色卡按色彩渐变顺序排列，评估辨色精度（D15 简化版，v1.2 新增）。',
  'mode.hue.meta': '约 3 分钟 · 排列',
  'mode.advanced.title': '进阶版',
  'mode.advanced.desc': '石原氏 38 题 + 路径追踪 + 色相排列三模块联合判读，交叉验证，结果最全面（v1.3 新增）。',
  'mode.advanced.meta': '约 19 分钟 · 三模块',
  'mode.child.title': '儿童模式',
  'mode.child.desc': '用图形替代数字题，适合 5–10 岁儿童，共 10 题（v1.7.9 新增）。',
  'mode.child.meta': '约 3 分钟 · 10 题',
  'driver.title': '驾驶 / 职业体检准备',
  'driver.desc': '以下入口针对报考驾照、从事对色觉有要求的职业等场景：报告将对照驾照辨色力要求给出参考，并隐藏趣味元素。建议先做屏幕校准。',
  'driver.standard': '标准版（驾驶场景）',
  'driver.standardDesc': '完整 38 题检测，结果页附「驾照辨色力参考」与免责声明。',
  'driver.signal': '信号灯辨识',
  'driver.signalDesc': '模拟路口与夜间行车的红 / 绿 / 黄信号辨识，验证驾驶辨色能力。',
  'child.chip': '儿童模式',
  'child.title': '图形辨色小游戏',
  'child.desc': '适合 5–10 岁：不用读数字，只看彩色圆点里藏着什么图形，点一下你认为的答案即可。共 10 题，约 3 分钟。',
  'child.progress': '第 {n} / {total} 题',
  'child.demo': '演示题 · 大家一起看',
  'child.pickShape': '看清后选择图形',
  'child.optionsLabel': '选择你看到的图形',
  'child.noShape': '看不清 / 没有图形',
  'child.saving': '已记录，正在生成结果…',
  'child.callout': '儿童版是',
  'common.analysisNote': '筛查参考，不替代专业医学诊断',
  'profile.all': '全部档案',
  'profile.switch': '切换档案',
  'profile.manage': '管理档案',
  'profile.add': '新增档案',
  'profile.name': '名称',
  'profile.relation': '关系（如父亲 / 女儿）',
  'profile.avatar': '头像',
  'profile.rename': '重命名',
  'profile.delete': '删除',
  'profile.deleteConfirm': '删除该成员及其历史记录？此操作不可撤销。',
  'profile.current': '当前',
  'history.export': '导出历史',
  'history.import': '导入历史',
  'history.exportSummary': '导出汇总表',
  'history.importError': '导入失败：',
  'history.importDone': '导入完成：新增 {a} 条结果、{p} 个档案',
  'batch.title': '批量检测',
  'batch.desc': '录入多名被测者，逐人完成标准检测，最后导出汇总表。适合学校、企业等场景的初步筛查。',
  'batch.names': '被测者名单（每行一个姓名）',
  'batch.start': '生成档案并开始',
  'batch.goTest': '去检测',
  'batch.done': '已完成',
  'batch.pending': '待检测',
  'batch.none': '还没有被测者。在上方录入名单后点「生成档案并开始」。',
  'batch.summary': '导出汇总表',
  'batch.hint': '每位被测者会建立独立档案；检测结果自动归属其名下，可在历史页查看或导出汇总。',
  'batch.meta': '录入多人 · 逐人检测 · 汇总导出',
};

const EN: Dict = {
  'nav.home': 'Home',
  'nav.test': 'Start test',
  'nav.history': 'History',
  'nav.lang': 'Language',
  'home.chip': 'Online color vision screening · Ishihara',
  'home.title': 'See the world in color — start with one self-test',
  'home.desc': 'ChromaCheck helps you understand your color vision at home: normal, anomalous, or color blind tendency, and whether it leans red-green or blue-yellow.',
  'home.ctaStart': 'Start test',
  'home.ctaLearn': 'Learn about color vision',
  'home.disclaimer': 'This tool is for screening only and cannot replace a professional eye examination.',
  'home.whyTitle': 'Why ChromaCheck',
  'home.stepsTitle': 'Three steps',
  'feat.science.title': 'Scientific basis',
  'feat.science.text': 'Ishihara-style iso-luminant plates: digits are formed by hue difference alone, revealing red-green and blue-yellow deficiencies.',
  'feat.quick.title': 'Fast screening',
  'feat.quick.text': 'Quick mode: 10 plates in about 3 minutes; standard mode: 38 plates in about 12 minutes — right in your browser.',
  'feat.dims.title': 'Axis analysis',
  'feat.dims.text': 'Reports protan / deutan / tritan tendency with a confidence score — far richer than pass or fail.',
  'feat.privacy.title': 'Privacy first',
  'feat.privacy.text': 'Results and history stay in your own browser, never uploaded; review or delete them any time.',
  'step1.title': 'Pick a mode',
  'step1.text': 'Quick or standard, whichever fits.',
  'step2.title': 'Read the plates',
  'step2.text': 'Say the digits you see — trust your first impression, do not guess.',
  'step3.title': 'See the result',
  'step3.text': 'Get the verdict, axis chart and item details instantly.',
  'select.chip': 'Start test',
  'select.title': 'Choose a test mode',
  'select.desc': 'Both Ishihara modes run entirely on your device and results stay in your browser. Start with Quick; choose Standard for a more robust conclusion.',
  'select.guideCallout': 'Please read the',
  'mode.quick.title': 'Quick',
  'mode.quick.desc': '10 core plates, about 3 minutes — ideal for a first check or periodic re-test.',
  'mode.quick.meta': '~3 min · 10 plates',
  'mode.standard.title': 'Standard',
  'mode.standard.desc': 'All 38 plates covering transformation, vanishing, hidden and classification types for a steadier result.',
  'mode.standard.meta': '~12 min · 38 plates',
  'mode.path.title': 'Path tracking',
  'mode.path.desc': 'Trace the path hidden among colored dots to probe red/green discrimination (added in v1.1).',
  'mode.path.meta': '~2 min · tracing',
  'mode.hue.title': 'Hue arrangement',
  'mode.hue.desc': 'Arrange 15 caps along the color gradient to assess discrimination accuracy (simplified D15, added in v1.2).',
  'mode.hue.meta': '~3 min · arrangement',
  'mode.advanced.title': 'Advanced',
  'mode.advanced.desc': 'All three modules (38 Ishihara plates + path tracking + hue arrangement) combined for cross-validation (added in v1.3).',
  'mode.advanced.meta': '~19 min · 3 modules',
  'mode.child.title': 'Kids mode',
  'mode.child.desc': 'Shapes instead of digits, for ages 5–10, 10 items (added in v1.7.9).',
  'mode.child.meta': '~3 min · 10 items',
  'driver.title': 'Driving / occupational exam prep',
  'driver.desc': 'For driving licence applicants and color-critical jobs: the report refers to licence color-vision requirements and hides playful elements. Calibrate your screen first.',
  'driver.standard': 'Standard (driving)',
  'driver.standardDesc': 'Full 38-plate test; the result page adds a licence color-vision reference and disclaimer.',
  'driver.signal': 'Signal light test',
  'driver.signalDesc': 'Identify red / green / yellow signals at junctions and night driving to verify driving color vision.',
  'child.chip': 'Kids mode',
  'child.title': 'Shape color game',
  'child.desc': 'For ages 5–10: no digits to read — just spot the shape hidden in the colored dots and tap your answer. 10 items, about 3 minutes.',
  'child.progress': 'Item {n} / {total}',
  'child.demo': 'Demo item · everyone can see it',
  'child.pickShape': 'Pick the shape once you see it',
  'child.optionsLabel': 'Choose the shape you see',
  'child.noShape': 'Not sure / no shape',
  'child.saving': 'Recorded — preparing your result…',
  'child.callout': 'Kids mode is',
  'common.analysisNote': 'Screening reference only, not a medical diagnosis',
  'profile.all': 'All profiles',
  'profile.switch': 'Switch profile',
  'profile.manage': 'Manage profiles',
  'profile.add': 'Add profile',
  'profile.name': 'Name',
  'profile.relation': 'Relation (e.g. Father / Daughter)',
  'profile.avatar': 'Avatar',
  'profile.rename': 'Rename',
  'profile.delete': 'Delete',
  'profile.deleteConfirm': 'Delete this member and their history? This cannot be undone.',
  'profile.current': 'Current',
  'history.export': 'Export history',
  'history.import': 'Import history',
  'history.exportSummary': 'Export summary',
  'history.importError': 'Import failed: ',
  'history.importDone': 'Import done: {a} new results, {p} new profiles',
  'batch.title': 'Batch screening',
  'batch.desc': 'Enter multiple subjects, screen each with the standard test, then export a summary. Ideal for schools and workplaces.',
  'batch.names': 'Subject list (one name per line)',
  'batch.start': 'Create profiles & start',
  'batch.goTest': 'Test',
  'batch.done': 'Done',
  'batch.pending': 'Pending',
  'batch.none': 'No subjects yet. Enter a list above and click “Create profiles & start”.',
  'batch.summary': 'Export summary',
  'batch.hint': 'Each subject gets a separate profile; their results are attributed automatically and viewable or exportable from History.',
  'batch.meta': 'Enter many · screen each · export summary',
};

const DICTS: Record<Lang, Dict> = { zh: ZH, en: EN };

/** 取译文；缺失时回退中文，避免界面出现键名 */
export function t(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  const raw = DICTS[lang]?.[key] ?? DICTS.zh[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_m, name: string) => String(vars[name] ?? `{${name}}`));
}
