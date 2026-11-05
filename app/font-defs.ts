// app/font-defs.ts — 自托管字体定义（next/font/local，构建期不联网）
// chromacheck v1.13.3
import localFont from 'next/font/local';

/**
 * 字体文件随仓库提交于 app/fonts/*.woff2（latin 子集，来源 @fontsource），
 * 故 EdgeOne / CI 等离线构建环境无需访问 fonts.gstatic.com。
 *
 * 对外暴露中间变量 --font-archivo / --font-plex-mono，由 globals.css 组合
 * 中文回退链；避免 next/font 变量与 :root 的 --font-sans/--font-mono 同名覆盖。
 */
export const archivo = localFont({
  src: [
    { path: './fonts/Archivo-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Archivo-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Archivo-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/Archivo-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Archivo-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-archivo',
  display: 'swap',
});

export const plexMono = localFont({
  src: [
    { path: './fonts/IBMPlexMono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/IBMPlexMono-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/IBMPlexMono-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
});
