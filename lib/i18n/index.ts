// lib/i18n/index.ts — 轻量双语字典入口（zh / en，零依赖）
// chromacheck v1.9.0
//
// 结构（单文件拆分为命名空间模块，避免单文件超 200 行）：
// - lang.ts       语言常量（Lang / 存储键 / 标签）
// - zh-core.ts    中文核心文案（导航 / 首页 / 模式 / 档案 / 历史 / 批量）
// - zh-ui.ts      中文界面文案（检测流程 / 结果 / 报告 / 指引 / 科普 / 画布）
// - zh-result.ts  中文判读文本（结果标签 + 分析模板）
// - en-*.ts       英文对应字典（键集合由中文派生，TS 强制完整性）
// - dict.ts       合并与键集合（DictKey = keyof ZH）
// - t.ts          取译文函数
//
// 使用：t(lang, 'key', { vars })；键名在 DictKey 联合类型内受编译期校验。

export * from './lang';
export * from './dict';
export * from './t';
