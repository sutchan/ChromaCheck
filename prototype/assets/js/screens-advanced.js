/* prototype/assets/js/screens-advanced.js v0.1.2 — 路径追踪 / 色相排列（D15） */
window.CC = window.CC || {};
CC.screens = CC.screens || {};

(function () {
  'use strict';

  /* ================= 路径追踪 ================= */
  CC.screens.path = {
    title: '路径追踪',
    render: function () {
      var p = CC.state.path;
      var i = p.index;
      return '<div class="test-shell">' +
        CC.view.nav('select') +
        '<div class="test-top">' +
          '<button class="btn btn--ghost btn--sm" data-go="select">退出</button>' +
          '<span class="idx mono">路径追踪 <strong>' + (i + 1) + '</strong> / 3</span>' +
          '<div class="bar-track" style="max-width:220px"><span class="bar-fill" style="width:' + ((i / 3) * 100) + '%"></span></div>' +
          '<div class="spacer"></div>' +
          '<span class="chip chip--outline">追踪可见的连续色点路径</span>' +
        '</div>' +
        '<div class="path-body">' +
          '<div class="path-canvas-wrap"><canvas id="path-canvas" aria-label="路径追踪检测图"></canvas></div>' +
          '<div class="path-tools">' +
            '<button class="btn btn--secondary" data-act="clear-path">重画</button>' +
            '<span class="overlap-read mono muted" id="path-read">尚未落笔</span>' +
            '<button class="btn btn--primary" data-act="submit-path">' + (i === 2 ? '完成进阶测试' : '提交本题') + '</button>' +
          '</div>' +
          '<p class="muted" style="font-size:13px;text-align:center;max-width:52ch">用鼠标或手指，沿着你能看出的那条连续色点，从起点一路描到终点。</p>' +
        '</div></div>';
    },

    mount: function (root) {
      var p = CC.state.path;
      var cv = root.querySelector('#path-canvas');
      var cfg = { seed: p.index + 1, kind: p.index, cvd: 'none', pathColor: '#c4553b' };
      var field = CC.renderPathField(cv, cfg);

      var snap = document.createElement('canvas');
      snap.width = cv.width; snap.height = cv.height;
      snap.getContext('2d').drawImage(cv, 0, 0);
      var ctx = cv.getContext('2d');
      var pts = [];
      var drawing = false;

      function redraw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.drawImage(snap, 0, 0);
        if (pts.length < 2) return;
        ctx.save();
        ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(14,20,27,.78)';
        ctx.beginPath();
        pts.forEach(function (q, i) {
          var x = q.x * cv.width, y = q.y * cv.height;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.stroke();
        ctx.restore();
      }

      function pos(e) {
        var r = cv.getBoundingClientRect();
        var src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - r.left) / r.width, y: (src.clientY - r.top) / r.height };
      }
      function live() {
        var read = root.querySelector('#path-read');
        if (!read) return;
        read.textContent = pts.length < 2 ? '尚未落笔' : '实时重合度 ' + CC.scorePath(pts, field.path) + '%';
      }

      function down(e) { e.preventDefault(); drawing = true; pts = [pos(e)]; redraw(); }
      function move(e) { if (!drawing) return; e.preventDefault(); pts.push(pos(e)); redraw(); live(); }
      function up() { if (!drawing) return; drawing = false; live(); }

      cv.addEventListener('mousedown', down);
      cv.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
      p._cleanup = function () { window.removeEventListener('mouseup', up); };
      cv.addEventListener('touchstart', down, { passive: false });
      cv.addEventListener('touchmove', move, { passive: false });
      cv.addEventListener('touchend', up);

      root.querySelector('[data-act="clear-path"]').addEventListener('click', function () {
        pts = []; redraw(); live();
      });
      root.querySelector('[data-act="submit-path"]').addEventListener('click', function () {
        var score = CC.scorePath(pts, field.path);
        p.results[p.index] = {
          questionId: 'path-0' + (p.index + 1), overlapScore: score,
          passed: score >= CC.rules.pathOverlap.pass, userPath: pts.slice()
        };
        if (p.index < 2) { p.index++; CC.go('path'); }
        else { CC.finishTest(); }
      });
    },

    unmount: function () {
      if (CC.state.path && CC.state.path._cleanup) {
        CC.state.path._cleanup();
        CC.state.path._cleanup = null;
      }
    }
  };

  /* ================= 色相排列 D15 ================= */
  var FIXED_LEFT = '#6b5fa8', FIXED_RIGHT = '#8a7bb2';

  function seqOf(order) { return [0].concat(order, [14]); }

  CC.screens.hue = {
    title: '色相排列',
    render: function () {
      var h = CC.state.hue;
      var order = h.order || (h.order = CC.hueShuffled.slice());
      var r = CC.scoreHue(seqOf(order));
      var T = CC.rules.tes;
      var verdict = r.totalErrorScore < T.normal
        ? ['chip--ok', '排列正常']
        : r.totalErrorScore <= T.mild ? ['chip--warn', '轻度偏差'] : ['chip--risk', '明显偏差'];

      var cards = ['<div class="hue-card is-fixed"><span class="sw" style="background:' + FIXED_LEFT + '"></span><span class="sn mono">参考</span></div>'];
      order.forEach(function (id, slot) {
        cards.push('<div class="hue-card' + (h.pick === slot ? ' is-sel' : '') + '" data-slot="' + slot + '">' +
          '<span class="sw" style="background:' + CC.hueCards[id] + '"></span>' +
          '<span class="sn mono">' + String(slot + 1).padStart(2, '0') + '</span></div>');
      });
      cards.push('<div class="hue-card is-fixed"><span class="sw" style="background:' + FIXED_RIGHT + '"></span><span class="sn mono">参考</span></div>');

      return '<div class="test-shell">' +
        CC.view.nav('select') +
        '<div class="test-top">' +
          '<button class="btn btn--ghost btn--sm" data-go="select">退出</button>' +
          '<span class="idx mono">色相排列 · D15</span>' +
          '<div class="spacer"></div>' +
          '<span class="chip ' + verdict[0] + '">' + verdict[1] + '</span>' +
          '<span class="mono">TES <strong id="tes-val">' + r.totalErrorScore + '</strong></span>' +
        '</div>' +
        '<div class="hue-body">' +
          '<div style="background:var(--n-100);border:1px solid var(--n-300);border-radius:var(--r-md);padding:10px 14px;font-size:13px;color:var(--fg-soft);margin-bottom:16px"><strong style="color:var(--fg)">示意功能</strong> · 色相排列（D15）为规划中的进阶模块，此处仅演示交互，结果不计入最终判读。</div>' +
          '<div><h3 style="font-size:var(--fs-h3)">把 15 张色卡按颜色渐变的顺序排好</h3>' +
          '<p class="muted" style="margin-top:8px">两端紫色卡固定不动。点击一张选中，再点另一张交换位置。</p></div>' +
          '<div class="hue-rail" id="hue-rail">' + cards.join('') + '</div>' +
          '<div class="row" style="gap:12px">' +
            '<button class="btn btn--secondary" data-act="shuffle-hue">重新打乱</button>' +
            '<span class="hint">偏差 &lt; 20 为正常，20–40 为轻度，&gt; 40 为明显异常</span>' +
            '<div class="spacer" style="margin-left:auto"></div>' +
            '<button class="btn btn--primary btn--lg" data-act="submit-hue">提交并查看结果</button>' +
          '</div>' +
        '</div></div>';
    },

    mount: function (root) {
      var h = CC.state.hue;
      root.querySelectorAll('[data-slot]').forEach(function (el) {
        el.addEventListener('click', function () {
          var slot = +el.getAttribute('data-slot');
          if (h.pick == null) { h.pick = slot; }
          else if (h.pick === slot) { h.pick = null; }
          else {
            var t = h.order[h.pick];
            h.order[h.pick] = h.order[slot];
            h.order[slot] = t;
            h.pick = null;
          }
          CC.rerender();
        });
      });
      root.querySelector('[data-act="shuffle-hue"]').addEventListener('click', function () {
        h.order = CC.hueShuffled.slice().sort(function () { return Math.random() - 0.5; });
        h.pick = null;
        CC.rerender();
      });
      root.querySelector('[data-act="submit-hue"]').addEventListener('click', function () {
        var r = CC.scoreHue(seqOf(h.order));
        CC.state.hueResult = r;
        CC.finishTest();
      });
    }
  };
})();
