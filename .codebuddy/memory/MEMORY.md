# 记忆索引

## 项目：ChromaCheck（e:/Github/ChromaCheck）
- 纯文档 + 静态原型项目，当前无 `package.json` / `VERSION` 单一版本源（原型文件头统一 v0.1.0）。
- 原型集（`prototype/`）四页互相链接、纯 HTML+CSS+原生 JS、无构建依赖：
  - `prototype.html`：高保真可交互产品原型（真实数据：`data.js` 24题/判读/历史/结果）+ 设备画框切换 + 色觉模拟
  - `wireframes.html`：组件库规范（基础/复合/业务组件 + 使用规则 + 无障碍基线）
  - `design-system.html`：设计系统（色彩/字体/间距·圆角·阴影/图标/动效令牌 + 色觉模拟基线）
  - `interaction.html`：交互标准（模式/反馈/错误/空状态，均可交互演示）
- 图标库：`prototype/assets/js/icons.js` 暴露 `CC.icon(name)`（24×24 线性 SVG，`currentColor` 继承）；`CC.ICON_GROUPS` 供展示。
- 设计令牌在 `prototype/assets/css/tokens.css` 为单一来源；样式分层 tokens / ui / screens / screens-test / docs（docs.css 另含规范页与交互演示样式）。
- 色觉绘制核心：`prototype/assets/js/ishihara.js` 暴露 `CC.renderPlate` / `CC.renderPathField` / `CC.simulate`；`renderPathField` 返回 `{W,H,path}`（path 为归一化坐标，用于重合度计算）。
