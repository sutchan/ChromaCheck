/* prototype/assets/js/charts.js v0.1.0 — 结果可视化（雷达 / 仪表 / 迷你趋势 / 大趋势） */
window.CC = window.CC || {};

(function () {
  'use strict';

  /** 雷达图：values 0-100，labels 与 values 等长 */
  function radar(values, labels, opts) {
    opts = opts || {};
    var n = values.length, S = 300, C = S / 2, R = C - 46;
    var ring = [0.25, 0.5, 0.75, 1], i, j;
    function pt(idx, r) {
      var a = -Math.PI / 2 + (idx / n) * Math.PI * 2;
      return [C + Math.cos(a) * R * r, C + Math.sin(a) * R * r];
    }
    var svg = '<svg viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="色觉维度雷达图">';
    ring.forEach(function (rr) {
      var d = [];
      for (i = 0; i < n; i++) { var p = pt(i, rr); d.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); }
      svg += '<polygon class="radar-grid" points="' + d.join(' ') + '"/>';
    });
    for (i = 0; i < n; i++) {
      var e = pt(i, 1);
      svg += '<line class="radar-grid" x1="' + C + '" y1="' + C + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '"/>';
    }
    var poly = [], dots = '';
    for (i = 0; i < n; i++) {
      var v = Math.max(0, Math.min(100, values[i])) / 100;
      var p2 = pt(i, v);
      poly.push(p2[0].toFixed(1) + ',' + p2[1].toFixed(1));
      dots += '<circle class="radar-dot" cx="' + p2[0].toFixed(1) + '" cy="' + p2[1].toFixed(1) + '" r="4"/>';
    }
    var shape = '<polygon class="radar-shape" points="' + poly.join(' ') + '"><animate attributeName="points" from="' +
      Array(n).fill(C + ',' + C).join(' ') + '" to="' + poly.join(' ') + '" dur="0.72s" fill="freeze" ' +
      'calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1"/></polygon>';
    svg += shape + dots;
    labels.forEach(function (lb, k) {
      var q = pt(k, 1.2);
      var anchor = Math.abs(q[0] - C) < 6 ? 'middle' : (q[0] > C ? 'start' : 'end');
      svg += '<text class="radar-axis" x="' + q[0].toFixed(1) + '" y="' + (q[1] + 4).toFixed(1) + '" text-anchor="' + anchor + '">' + lb + '</text>';
    });
    return svg + '</svg>';
  }

  /** 环形仪表：0-100 */
  function gauge(value, color) {
    var S = 168, r = 72, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
    return '<svg viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="置信度 ' + value + '">' +
      '<circle cx="84" cy="84" r="' + r + '" fill="none" stroke="var(--bg-sunken)" stroke-width="12"/>' +
      '<circle cx="84" cy="84" r="' + r + '" fill="none" stroke="' + (color || 'var(--brand)') + '" stroke-width="12" ' +
      'stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '">' +
      '<animate attributeName="stroke-dashoffset" from="' + c.toFixed(1) + '" to="' + off.toFixed(1) + '" dur="0.9s" fill="freeze" ' +
      'calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1"/></circle></svg>';
  }

  /** 迷你趋势柱（历史行内） */
  function spark(values, max) {
    var m = max || 100;
    return '<span class="spark">' + values.map(function (v) {
      var h = Math.max(4, Math.round((v / m) * 26));
      return '<i class="' + (v >= 40 ? 'hi' : '') + '" style="height:' + h + 'px"></i>';
    }).join('') + '</span>';
  }

  /** 折线趋势（历史对比） */
  function trend(values, labels) {
    var W = 640, H = 140, pad = 22;
    var max = Math.max.apply(null, values) * 1.2 || 100;
    var stepX = (W - pad * 2) / Math.max(values.length - 1, 1);
    var pts = values.map(function (v, i) {
      return [pad + i * stepX, H - pad - (v / max) * (H - pad * 2)];
    });
    var line = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var area = pad + ',' + (H - pad) + ' ' + line + ' ' + (W - pad) + ',' + (H - pad);
    var svg = '<svg class="trend" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="历史绿色觉评分趋势">';
    [0.25, 0.5, 0.75, 1].forEach(function (g) {
      var y = H - pad - (H - pad * 2) * g;
      svg += '<line class="gl" x1="' + pad + '" y1="' + y + '" x2="' + (W - pad) + '" y2="' + y + '"/>';
    });
    svg += '<polygon class="ar" points="' + area + '"/>';
    svg += '<polyline class="ln" points="' + line + '"/>';
    pts.forEach(function (p, i) {
      svg += '<circle class="pt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5">' +
        '<title>' + (labels[i] || '') + ' · ' + values[i] + '</title></circle>';
    });
    return svg + '</svg>';
  }

  /** 数字滚动 */
  function countUp(el, to, suffix) {
    var dur = 900, start = null, from = 0;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  CC.radar = radar;
  CC.gauge = gauge;
  CC.spark = spark;
  CC.trend = trend;
  CC.countUp = countUp;
})();
