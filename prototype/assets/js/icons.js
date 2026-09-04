/* prototype/assets/js/icons.js v0.1.0 — 图标库：内联 SVG 线性图标集 */
/* 统一 24×24 视框、stroke=currentColor，颜色随文字继承，色觉差异人群同样可辨。
   用法：CC.icon('palette') → 返回 <svg> 字符串；类名 .icon 控制尺寸。 */
window.CC = window.CC || {};

(function () {
  'use strict';

  // 内联路径数据（stroke 线性风格，1.8 描边）
  var P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9h14v-9"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>',
    'chevron-down': '<path d="M5 9l7 7 7-7"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 8h.01"/>',

    play: '<path d="M7 5l12 7-12 7z"/>',
    restart: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    check: '<path d="M5 12.5 10 17 19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5"/><path d="M5 20h14"/>',
    share: '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 10.9l7.8-3.8M8.1 13.1l7.8 3.8"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M9.5 5.4A10.6 10.6 0 0 1 12 5.5C18.5 5.5 22 12 22 12a17 17 0 0 1-3 3.7M6.2 7.3A17 17 0 0 0 2 12s3.5 6.5 10 6.5a10 10 0 0 0 3.3-.5"/><path d="M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',

    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.2-.8-1.6-.8-2.6 0-.9.7-1.4 1.6-1.4H17a4 4 0 0 0 4-4c0-4.4-4-7-9-7z"/><path d="M7.5 11.5h.01M11 8h.01M15 9.5h.01"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    flag: '<path d="M6 21V4h11l-2 4 2 4H6"/>',
    'alert-triangle': '<path d="M12 4 22 20H2z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    'alert-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5"/><path d="M12 16h.01"/>',
    'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.5 11 15.5 16 9"/>',
    'x-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2M3.5 4v3.5H7"/><path d="M12 8v4l3 2"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.3 6.3 0 0 0 20 14.5z"/>',
    sliders: '<path d="M4 7h11M19 7h1M4 17h1M9 17h11"/><circle cx="17" cy="7" r="2.2"/><circle cx="7" cy="17" r="2.2"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h5M10 16.5h5"/>',
    wifi: '<path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0M9 16a4.5 4.5 0 0 1 6 0"/><path d="M12 19.5h.01"/>',
    heart: '<path d="M12 20s-7-4.4-9.3-9C1.3 8 3 4.6 6.4 4.6c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 3.4 0 5.1 3.4 3.7 6.4C19 15.6 12 20 12 20z"/>'
  };

  CC.ICON_GROUPS = [
    { name: '导航 / 通用', keys: ['home', 'menu', 'settings', 'search', 'info', 'chevron-right', 'chevron-down', 'close', 'sliders'] },
    { name: '操作 / 动作', keys: ['play', 'restart', 'download', 'share', 'copy', 'eye', 'eye-off', 'doc', 'check', 'x'] },
    { name: '检测 / 状态', keys: ['palette', 'grid', 'target', 'flag', 'user', 'clock', 'history', 'heart', 'sun', 'moon'] },
    { name: '反馈 / 警示', keys: ['alert-triangle', 'alert-circle', 'check-circle', 'x-circle', 'wifi'] }
  ];

  CC.icon = function (name, cls) {
    var inner = P[name];
    if (!inner) return '';
    var c = 'icon' + (cls ? ' ' + cls : '');
    return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + '</svg>';
  };

  CC.ICON_NAMES = Object.keys(P);
})();
