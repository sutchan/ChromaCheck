/* prototype/assets/js/design-system.js v0.1.2 — 色觉模拟基线小样生成 */
(function () {
  'use strict';
  /* 与 ishihara.js 的 CC.simulate 保持同一套矩阵 + 2.2 gamma 校正，避免两处模拟口径不一致 */
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (x) { return x + x; }).join('');
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function cl(v) { return Math.max(0, Math.min(255, Math.round(v))); }
  function simulate(hex, type) {
    var c = hexToRgb(hex);
    if (!type || type === 'none') return hex;
    var M = {
      protan: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
      deutan: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
      tritan: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
      mono: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]]
    }[type];
    if (!M) return hex;
    var lin = [Math.pow(c.r / 255, 2.2), Math.pow(c.g / 255, 2.2), Math.pow(c.b / 255, 2.2)];
    var o = [
      M[0][0] * lin[0] + M[0][1] * lin[1] + M[0][2] * lin[2],
      M[1][0] * lin[0] + M[1][1] * lin[1] + M[1][2] * lin[2],
      M[2][0] * lin[0] + M[2][1] * lin[1] + M[2][2] * lin[2]
    ];
    var r = cl(Math.pow(Math.max(o[0], 0), 1 / 2.2) * 255);
    var g = cl(Math.pow(Math.max(o[1], 0), 1 / 2.2) * 255);
    var b = cl(Math.pow(Math.max(o[2], 0), 1 / 2.2) * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function build() {
    var samples = [
      ['品牌红', '#c4553b'], ['品牌蓝', '#2f6f9e'], ['OK 绿', '#2e9e6b'],
      ['琥珀', '#e0a23b'], ['紫', '#7a5cc0'], ['深灰', '#2a2f37']
    ];
    var types = [['正常', 'none'], ['红色盲', 'protan'], ['绿色盲', 'deutan'], ['蓝色盲', 'tritan'], ['全色盲', 'mono']];
    var html = '<div class="sim-row sim-head"><div class="sim-name"></div>' +
      types.map(function (t) { return '<div>' + t[0] + '</div>'; }).join('') + '</div>';
    samples.forEach(function (s) {
      html += '<div class="sim-row"><div class="sim-name">' + s[0] + '</div>' +
        types.map(function (t) {
          return '<span class="sim-cell" style="background:' + simulate(s[1], t[1]) + '" title="' + s[0] + ' · ' + t[0] + '"></span>';
        }).join('') + '</div>';
    });
    var g = document.getElementById('sim-grid');
    if (g) g.innerHTML = html;
  }
  document.addEventListener('DOMContentLoaded', build);
})();

/* prototype/assets/js/design-system.js v0.1.2（续）— 图标库 + 动效令牌渲染 */
(function () {
  'use strict';

  function renderIcons() {
    var host = document.getElementById('icon-groups');
    if (!host || !window.CC || !CC.ICON_GROUPS) return;
    host.innerHTML = CC.ICON_GROUPS.map(function (g) {
      var cells = g.keys.map(function (k) {
        return '<div class="icon-cell" title="' + k + '">' +
          CC.icon(k) + '<code>' + k + '</code></div>';
      }).join('');
      return '<div class="icon-group"><h4>' + g.name + '</h4><div class="icon-cell-row">' +
        cells + '</div></div>';
    }).join('');
  }

  function renderMotionTokens() {
    var host = document.getElementById('motion-tokens');
    if (!host) return;
    var items = [
      ['--ease', 'cubic-bezier(.22,1,.36,1)', '标准缓出'],
      ['--ease-in-out', 'cubic-bezier(.6,0,.35,1)', '对称缓动'],
      ['--d-1', '120ms', '超快 · 悬停'],
      ['--d-2', '180ms', '快 · 微交互'],
      ['--d-3', '280ms', '中 · 反馈'],
      ['--d-4', '480ms', '慢 · 进入'],
      ['--d-5', '760ms', '最慢 · 重屏']
    ];
    host.innerHTML = items.map(function (t) {
      return '<div class="token-item"><div class="v">' + t[0] + '</div>' +
        '<div class="muted" style="font-size:12px">' + t[1] + '</div>' +
        '<div class="meta">' + t[2] + '</div></div>';
    }).join('');
  }

  function renderMotionGrid() {
    var host = document.getElementById('motion-grid');
    if (!host) return;
    var rows = [
      ['cc-rise', '元素进入', '上移 14px + 淡入', '--d-4'],
      ['cc-fade', '显隐切换', '纯透明度过渡', '--d-3'],
      ['cc-pop', '强调出现', '缩放弹入（0.6→1.08→1）', '--d-3'],
      ['cc-shimmer', '骨架加载', '高光自左向右扫过', '--d-5'],
      ['cc-pulse', '引导注意', '聚焦环呼吸扩散', '--d-4']
    ];
    host.innerHTML = rows.map(function (r) {
      return '<div class="motion-card"><div class="motion-tag">' + r[0] + '</div>' +
        '<div class="motion-desc"><b>' + r[1] + '</b><span class="muted">' + r[2] + '</span></div>' +
        '<code class="motion-dur">' + r[3] + '</code></div>';
    }).join('');
  }

  function wireMotionDemos() {
    var replay = document.getElementById('btn-replay');
    if (replay) replay.addEventListener('click', function () {
      var box = document.getElementById('rise-box');
      box.classList.remove('rise'); void box.offsetWidth; box.classList.add('rise');
    });
    var prog = document.getElementById('btn-progress');
    if (prog) prog.addEventListener('click', function () {
      var fill = document.getElementById('bar-fill');
      fill.style.width = '0%'; void fill.offsetWidth; fill.style.width = '100%';
    });
    var skel = document.getElementById('btn-skeleton');
    if (skel) skel.addEventListener('click', function () {
      var el = document.getElementById('skel');
      el.classList.remove('is-on'); void el.offsetWidth; el.classList.add('is-on');
    });
    var pulse = document.getElementById('btn-pulse');
    if (pulse) pulse.addEventListener('click', function () {
      var dot = document.getElementById('pulse-dot');
      dot.classList.remove('is-on'); void dot.offsetWidth; dot.classList.add('is-on');
    });
  }

  function rgbToHex(c) {
    var m = String(c).match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return c;
    function h(x) { var n = Math.round(parseFloat(x)).toString(16); return n.length === 1 ? '0' + n : n; }
    return '#' + h(m[0]) + h(m[1]) + h(m[2]);
  }
  function syncSwatchLabels() {
    var sw = document.querySelectorAll('.swatch');
    for (var i = 0; i < sw.length; i++) {
      var c = sw[i].querySelector('.c');
      var v = sw[i].querySelector('.v');
      if (!c || !v) continue;
      var bg = getComputedStyle(c).backgroundColor;
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') { v.textContent = '（令牌未定义）'; continue; }
      v.textContent = rgbToHex(bg);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderIcons();
    renderMotionTokens();
    renderMotionGrid();
    wireMotionDemos();
    syncSwatchLabels();
  });
})();
