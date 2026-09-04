/* prototype/assets/js/design-system.js v0.1.0 — 色觉模拟基线小样生成 */
(function () {
  'use strict';
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
    var r = cl(M[0][0] * c.r + M[0][1] * c.g + M[0][2] * c.b);
    var g = cl(M[1][0] * c.r + M[1][1] * c.g + M[1][2] * c.b);
    var b = cl(M[2][0] * c.r + M[2][1] * c.g + M[2][2] * c.b);
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
