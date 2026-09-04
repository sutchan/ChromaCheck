# 安全政策

## 支持版本

我们仅对仓库根目录 `VERSION` 文件标注的最新稳定版本提供安全更新。请始终使用最新版本，以获取已修复的安全问题。

## 报告漏洞

如果你发现 ChromaCheck 存在安全漏洞，请**不要**通过公开 Issue 披露。请通过以下方式私密报告：

- **GitHub Security Advisory（推荐）**：在仓库 **Security → Report a vulnerability** 中提交
- **或发送邮件至**：[contact@chromacheck.example]

请在报告中尽量包含：

- 漏洞类型与影响范围
- 复现步骤（如有）
- 受影响版本号（见 `VERSION`）

我们会在收到报告后尽快确认、评估并修复，并与你保持沟通。

## 隐私说明

ChromaCheck 是**纯前端、本地优先**的色觉筛查应用：

- 所有检测数据仅保存在浏览器 `localStorage`，**不**上传任何服务器。
- v1.0 版本**未实现**任何数据上报/分析功能（匿名上报为 v1.1 规划）。
- 因此不存在服务端数据泄露风险；相关隐私承诺详见隐私政策页（`/privacy`）与 `docs/PRIVACY.md`。

## 安全实践

- 依赖定期审计（`npm outdated` / Dependabot）。
- 生产环境强制 HTTPS。
- 代码与日志中不得包含密钥、Token。
- 用户输入在渲染前经过校验与转义，防范 XSS。
