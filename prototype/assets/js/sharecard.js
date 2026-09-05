/* prototype/assets/js/sharecard.js v0.1.0 — 色觉人格分享卡：Canvas 手绘 + PNG 导出（零依赖） */
window.CC = window.CC || {};

(function () {
  'use strict';

  var W = 720, H = 960;

  /* 文本自动换行 */
  function wrapText(ctx, text, x, y, maxW, lh) {
    var line = '', lines = [];
    for (var i = 0; i < text.length; i++) {
      if (ctx.measureText(line + text[i]).width > maxW) { lines.push(line); line = text[i]; }
      else line += text[i];
    }
    if (line) lines.push(line);
    lines.forEach(function (ln, k) { ctx.fillText(ln, x, y + k * lh); });
    return y + lines.length * lh;
  }

  /* Canvas 版六轴雷达（与 charts.js 的 SVG 雷达同参数） */
  function drawRadar(ctx, values, labels, cx, cy, R, color) {
    var n = values.length, i, j;
    function pt(idx, r) {
      var a = -Math.PI / 2 + (idx / n) * Math.PI * 2;
      return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r];
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach(function (rr) {
      ctx.beginPath();
      for (i = 0; i < n; i++) {
        var p = pt(i, rr);
        i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
      }
      ctx.closePath(); ctx.stroke();
    });
    for (i = 0; i < n; i++) {
      var e = pt(i, 1);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(e[0], e[1]); ctx.stroke();
    }
    ctx.beginPath();
    for (j = 0; j < n; j++) {
      var p2 = pt(j, Math.max(0, Math.min(100, values[j])) / 100);
      j ? ctx.lineTo(p2[0], p2[1]) : ctx.moveTo(p2[0], p2[1]);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(75,61,240,0.38)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = color;
    for (j = 0; j < n; j++) {
      var p3 = pt(j, Math.max(0, Math.min(100, values[j])) / 100);
      ctx.beginPath(); ctx.arc(p3[0], p3[1], 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = '13px Archivo, "PingFang SC", sans-serif';
    labels.forEach(function (lb, k) {
      var q = pt(k, 1.22);
      ctx.textAlign = Math.abs(q[0] - cx) < 6 ? 'center' : (q[0] > cx ? 'left' : 'right');
      ctx.fillText(lb, q[0], q[1] + 4);
    });
    ctx.textAlign = 'left';
  }

  /**
   * 绘制分享卡
   * @param {HTMLCanvasElement} canvas
   * @param {{overall:string,type:?string,severity:?string,confidence:number,dimensions:Object}} ish 判读结果
   * @param {number[]} radarValues 六轴值
   * @param {string[]} radarLabels 六轴标签
   * @param {string} dateText 展示日期
   */
  CC.drawShareCard = function (canvas, ish, radarValues, radarLabels, dateText) {
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var VERDICT = {
      normal: ['#0e8a99', '色觉正常'],
      suspected_deficiency: ['#e8a03c', '疑似色弱'],
      suspected_blindness: ['#f08b84', '疑似色盲'],
      inconclusive: ['#7c8798', '结果不确定']
    };
    var v = VERDICT[ish.overall] || VERDICT.inconclusive;
    var color = v[0];
    var fun = CC.fun();
    var titleKey = ish.type || (ish.overall === 'inconclusive' ? 'inconclusive' : 'normal');
    var title = fun && CC.titles && CC.titles[titleKey];

    /* 背景：暗色仪器外壳 + 点阵母题 */
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#10161f');
    bg.addColorStop(1, '#1c2530');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.arc(52 + i * 32, 40 + j * 26, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = i < 3 ? 'rgba(142,133,255,0.5)' : 'rgba(255,255,255,0.10)';
        ctx.fill();
      }
    }

    /* 品牌行 */
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '700 22px Archivo, "PingFang SC", sans-serif';
    ctx.fillText('色辨 ChromaCheck', 52, 96);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '13px "IBM Plex Mono", monospace';
    ctx.fillText('ONLINE COLOR VISION SCREENING', 52, 118);

    /* 结论 */
    ctx.fillStyle = color;
    ctx.font = '800 44px Archivo, "PingFang SC", sans-serif';
    ctx.fillText(v[1], 52, 196);
    var sub = (ish.type ? CC.typeText[ish.type] : '') +
      (ish.severity ? ' · ' + CC.severityText[ish.severity] : '');
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(sub || '本次未得出类型结论', 52, 228);

    /* 称号（趣味体验）或中性说明 */
    var y = 268;
    if (title) {
      ctx.fillStyle = '#8e85ff';
      ctx.font = '700 26px Archivo, "PingFang SC", sans-serif';
      ctx.fillText('「' + title.name + '」', 52, y);
      ctx.fillStyle = 'rgba(255,255,255,0.62)';
      ctx.font = '15px "PingFang SC", "Microsoft YaHei", sans-serif';
      y = wrapText(ctx, title.desc, 52, y + 30, W - 104, 24) + 6;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '15px "PingFang SC", "Microsoft YaHei", sans-serif';
      y = wrapText(ctx, '本报告仅基于本机检测数据生成，仅供筛查参考，不构成医学诊断。', 52, y, W - 104, 24) + 6;
    }

    /* 雷达 */
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '600 14px "IBM Plex Mono", monospace';
    ctx.fillText('COLOR VISION PROFILE / 色觉画像', 52, y + 34);
    drawRadar(ctx, radarValues, radarLabels, W / 2, y + 250, 150, color);

    /* 三轴数值条 */
    var dims = [['红色觉', ish.dimensions.protan], ['绿色觉', ish.dimensions.deutan], ['蓝色觉', ish.dimensions.tritan]];
    var by = y + 470;
    dims.forEach(function (d, k) {
      var dy = by + k * 40;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '15px "PingFang SC", sans-serif';
      ctx.fillText(d[0], 52, dy + 14);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(120, dy, W - 224, 10);
      ctx.fillStyle = color;
      ctx.fillRect(120, dy, (W - 224) * Math.min(100, d[1]) / 100, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '600 14px "IBM Plex Mono", monospace';
      ctx.fillText(String(d[1]), W - 84, dy + 12);
    });

    /* 页脚 */
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(52, H - 96); ctx.lineTo(W - 52, H - 96); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px "PingFang SC", sans-serif';
    ctx.fillText('置信度 ' + ish.confidence + ' / 100 · ' + (dateText || ''), 52, H - 62);
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '12px "PingFang SC", sans-serif';
    ctx.fillText('筛查参考，不替代专业医学诊断 · 数据不出本机', 52, H - 38);
  };

  /** 导出 PNG（canvas 无外源图像，不会被污染） */
  CC.exportShareCard = function (canvas) {
    var a = document.createElement('a');
    a.download = 'chromacheck-share-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
})();
