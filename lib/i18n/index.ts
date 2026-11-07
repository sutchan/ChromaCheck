// lib/i18n/index.ts — 轻量多语言字典入口（zh 默认 > zh-TW > en，零依赖）
// chromacheck v1.15.0
//
// 结构（单文件拆分为命名空间模块，避免单文件超 200 行）：
// - lang.ts       语言常量（Lang / 优先级顺序 / 存储键 / 标签 / htmlLang）
// - zh-core.ts    简体核心文案（导航 / 首页 / 模式 / 档案 / 历史 / 批量）
// - zh-faq.ts     简体首页常见问题（FAQ 问答对）
// - zh-ui.ts      简体界面文案（检测流程 / 结果 / 报告 / 指引 / 科普 / 画布）
// - zh-result.ts  简体判读文本（结果标签 + 分析模板）
// - tw-*.ts       繁体（台湾）对应字典（v1.15.0 新增，键集合由中文派生，TS 强制完整性）
// - en-*.ts       英文对应字典（键集合由中文派生，TS 强制完整性）
// - dict.ts       合并与键集合（DictKey = keyof ZH）
// - t.ts          取译文函数（缺失时回退简体中文）
//
// 使用：t(lang, 'key', { vars })；键名在 DictKey 联合类型内受编译期校验。

export * from './lang';
export * from './dict';
export * from './t';
