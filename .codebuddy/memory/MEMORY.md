# 记忆索引

## 项目：ChromaCheck（e:/Github/ChromaCheck）
- 纯文档 + 静态原型项目，当前无 `package.json` / `VERSION` 单一版本源（原型文件头统一 v0.1.0）。
- 原型集（`prototype/`）：`prototype.html`（高保真交互）/ `wireframes.html`（组件库）/ `design-system.html`（设计系统），纯 HTML+CSS+原生 JS，无构建依赖，三页互相链接。
- 设计令牌在 `prototype/assets/css/tokens.css` 为单一来源；样式分层 tokens / ui / screens / screens-test / docs。
- 色觉绘制核心：`prototype/assets/js/ishihara.js` 暴露 `CC.renderPlate` / `CC.renderPathField` / `CC.simulate`；`renderPathField` 返回 `{W,H,path}`（path 为归一化坐标，用于重合度计算）。
