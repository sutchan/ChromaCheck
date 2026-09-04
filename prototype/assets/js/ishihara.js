/* prototype/assets/js/ishihara.js v0.1.0 — 点阵检测图生成 / 色觉模拟 / 路径追踪画布 */
window.CC = window.CC || {};

(function () {
  'use strict';

  /* ---------- 色觉模拟矩阵（Viénot-Brettel 近似） ---------- */
  var CVD_MATRIX = {
    none:        [1, 0, 0, 0, 1, 0, 0, 0, 1],
    protanopia:  [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
    deuteranopia:[0.625, 0.375, 0, 0.700, 0.300, 0, 0, 0.300, 0.700],
    tritanopia:  [0.950, 0.050, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
    achromatopsia:[0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114]
  };

  function hexToRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToCss(r, g, b) {
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }
  /** 在近似线性空间应用矩阵，避免暗部偏色 */
  function simulate(hex, kind) {
    var m = CVD_MATRIX[kind] || CVD_MATRIX.none;
    if (kind === 'none') return hex;
    var c = hexToRgb(hex).map(function (v) { return Math.pow(v / 255, 2.2) * 255; });
    var o = [
      m[0] * c[0] + m[1] * c[1] + m[2] * c[2],
      m[3] * c[0] + m[4] * c[1] + m[5] * c[2],
      m[6] * c[0] + m[7] * c[1] + m[8] * c[2]
    ].map(function (v) { return Math.pow(Math.max(v, 0) / 255, 1 / 2.2) * 255; });
    return rgbToCss(o[0], o[1], o[2]);
  }

  /* ---------- 调色板（取自石原氏图谱实际用色范围） ---------- */
  var PALETTE = {
    demonstration:  { fig: ['#3e7cb1', '#4a88bd'], bg: ['#d8c79c', '#c9b98d', '#e0d3ae', '#bda97c'] },
    normal:         { fig: ['#3e7cb1', '#37719f'], bg: ['#d8c79c', '#c9b98d', '#e2d5b2', '#bda97c'] },
    transformation: { fig: ['#c4553b', '#cf6a45'], bg: ['#8fa05a', '#a9b581', '#c3c8a8', '#6f7f4a', '#d3cdbb'] },
    vanishing:      { fig: ['#d97b45', '#cf7a52'], bg: ['#93a45e', '#a7b47a', '#c0c2a4', '#75864c'] },
    hidden:         { fig: ['#b9a87e', '#c2b189'], bg: ['#c6b48a', '#d0bf98', '#bda97c'] },
    classification: { fig: ['#c4553b', '#b84f38'], bg: ['#8fa05a', '#a9b581', '#c3c8a8', '#6f7f4a'] }
  };

  /* ---------- 确定性随机（同一图版每次渲染一致） ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- 点阵生成（dart throwing + 网格加速） ---------- */
  function buildDots(rng, size, rMin, rMax, max) {
    var cell = rMax * 2, cols = Math.ceil(size / cell), grid = {}, dots = [];
    var R = size / 2 - rMax - 3, tries = max * 40;
    for (var t = 0; t < tries && dots.length < max; t++) {
      var x = rng() * size, y = rng() * size;
      var dx = x - size / 2, dy = y - size / 2;
      if (dx * dx + dy * dy > R * R) continue;
      var gx = Math.floor(x / cell), gy = Math.floor(y / cell), ok = true;
      for (var oy = -1; oy <= 1 && ok; oy++) {
        for (var ox = -1; ox <= 1 && ok; ox++) {
          var b = grid[(gy + oy) * cols + (gx + ox)];
          if (!b) continue;
          for (var k = 0; k < b.length; k++) {
            if (Math.hypot(b[k].x - x, b[k].y - y) < (b[k].r + rMin) * 0.9) { ok = false; break; }
          }
        }
      }
      if (!ok) continue;
      var d = { x: x, y: y, r: rMin + rng() * (rMax - rMin) };
      dots.push(d);
      var gi = gy * cols + gx;
      (grid[gi] = grid[gi] || []).push(d);
    }
    return dots;
  }

  /* ---------- 数字蒙版 ---------- */
  function buildMask(text, size, rng) {
    var off = document.createElement('canvas');
    off.width = off.height = size;
    var c = off.getContext('2d');
    var fs = size * (text.length > 2 ? 0.46 : 0.58);
    c.fillStyle = '#000';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '700 ' + fs + 'px Archivo, "PingFang SC", system-ui, sans-serif';
    c.fillText(text, size / 2, size / 2 + fs * 0.02);
    var data = c.getImageData(0, 0, size, size).data;
    return function (x, y) {
      var i = ((y | 0) * size + (x | 0)) * 4 + 3;
      return data[i] > 110;
    };
  }

  /**
   * 渲染点阵检测图
   * @param {HTMLCanvasElement} canvas
   * @param {{text:string,type:string,seed:number,cvd:string,dots:number,animate:boolean}} o
   */
  function renderPlate(canvas, o) {
    var size = 720;
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');
    var rng = mulberry32((o.seed || 1) * 9176 + 13);
    var pal = PALETTE[o.type] || PALETTE.normal;
    var cvd = o.cvd || 'none';
    var text = o.text || '';

    var inGlyph = text ? buildMask(text, size, rng) : function () { return false; };
    var dots = buildDots(rng, size, 9, 15, o.dots || 2300);
    // 洗牌，令揭示动画无序扩散
    for (var i = dots.length - 1; i > 0; i--) {
      var j = (rng() * (i + 1)) | 0, t = dots[i]; dots[i] = dots[j]; dots[j] = t;
    }

    function paint(progress) {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = simulate('#efe9db', cvd);
      ctx.fillRect(0, 0, size, size);

      var n = Math.floor(dots.length * progress);
      for (var k = 0; k < n; k++) {
        var d = dots[k];
        var isFig = inGlyph(d.x, d.y);
        var set = isFig ? pal.fig : pal.bg;
        var hex = set[(k + (isFig ? 1 : 0)) % set.length];
        ctx.beginPath();
        var rr = k > n - 90 ? d.r * (0.35 + 0.65 * ((k - (n - 90)) / 90)) : d.r;
        ctx.arc(d.x, d.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = simulate(hex, cvd);
        ctx.fill();
      }
      ctx.restore();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(16,22,30,.10)';
      ctx.stroke();
    }

    if (o.animate === false) { paint(1); return; }
    var start = null, dur = 720;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      paint(p < 1 ? 1 - Math.pow(1 - p, 3) : 1);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 路径追踪：标准路径 ---------- */
  function standardPath(kind) {
    var pts = [], i;
    if (kind === 0) { // S 形
      for (i = 0; i <= 40; i++) { var t = i / 40; pts.push({ x: 0.16 + 0.68 * t, y: 0.5 + 0.28 * Math.sin(t * Math.PI * 2) }); }
    } else if (kind === 1) { // 螺旋
      for (i = 0; i <= 40; i++) { var a = (i / 40) * Math.PI * 2.6, r = 0.12 + 0.3 * (i / 40); pts.push({ x: 0.5 + r * Math.cos(a), y: 0.5 + r * Math.sin(a) }); }
    } else { // 之字形
      for (i = 0; i <= 40; i++) { var u = i / 40; pts.push({ x: 0.15 + 0.7 * u, y: 0.28 + 0.44 * Math.abs(Math.sin(u * Math.PI * 1.5)) }); }
    }
    return pts;
  }

  /** 渲染路径追踪点阵底图 */
  function renderPathField(canvas, cfg) {
    var W = 700, H = 520;
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var rng = mulberry32(cfg.seed * 7717 + 3);
    var cvd = cfg.cvd || 'none';
    ctx.fillStyle = simulate('#efe9db', cvd);
    ctx.fillRect(0, 0, W, H);

    var path = standardPath(cfg.kind);
    var near = path.map(function (p) { return { x: p.x * W, y: p.y * H }; });

    var cell = 26, cols = Math.ceil(W / cell), grid = {}, dots = [], tries = 9000;
    for (var t = 0; t < tries && dots.length < 1500; t++) {
      var x = rng() * W, y = rng() * H, ok = true;
      var gx = Math.floor(x / cell), gy = Math.floor(y / cell);
      for (var oy = -1; oy <= 1 && ok; oy++) {
        for (var ox = -1; ox <= 1 && ok; ox++) {
          var b = grid[(gy + oy) * cols + (gx + ox)];
          if (!b) continue;
          for (var k = 0; k < b.length; k++) if (Math.hypot(b[k].x - x, b[k].y - y) < 17) { ok = false; break; }
        }
      }
      if (!ok) continue;
      var d = { x: x, y: y, r: 7 + rng() * 4.5 };
      dots.push(d);
      var gi = gy * cols + gx;
      (grid[gi] = grid[gi] || []).push(d);
    }

    dots.forEach(function (d, idx) {
      var isPath = near.some(function (p) { return Math.hypot(p.x - d.x, p.y - d.y) < 26; });
      var hex = isPath ? (cfg.pathColor || '#c4553b') : ['#8fa05a', '#a9b581', '#c3c8a8', '#6f7f4a'][idx % 4];
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = simulate(hex, cvd);
      ctx.fill();
    });
    return { W: W, H: H, path: path };
  }

  CC.simulate = simulate;
  CC.renderPlate = renderPlate;
  CC.renderPathField = renderPathField;
  CC.standardPath = standardPath;
  CC.CVD_MATRIX = CVD_MATRIX;
})();
