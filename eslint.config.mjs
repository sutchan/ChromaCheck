// eslint.config.mjs — Next 16 扁平 ESLint 配置（迁移自 .eslintrc.json）
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  { ignores: ['.next/**', 'coverage/**', 'reports/**', '.tmp/**', 'node_modules/**', 'prototype/**'] },
  ...nextCoreWebVitals,
];
