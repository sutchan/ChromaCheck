/* prototype/assets/js/screens-test.js v0.1.0 — 石原氏数字图检测屏（可真实作答） */
window.CC = window.CC || {};
CC.screens = CC.screens || {};

(function () {
  'use strict';
  var esc = CC.view.esc;

  function pdotClass(i) {
    if (i === CC.state.test.index) return 'pdot is-current';
    var rec = CC.state.test.answers[CC.state.test.set[i].id];
    if (!rec) return 'pdot';
    return rec.correct ? 'pdot is-done' : 'pdot is-wrong';
  }

  function elapsed() {
    var s = Math.floor((Date.now() - CC.state.test.start) / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  CC.screens.ishihara = {
    title: '石原氏测试',
    render: function () {
      var t = CC.state.test;
      var q = t.set[t.index];
      var rec = t.answers[q.id];
      var buf = CC.state.buffer || '';
      var isLast = t.index === t.set.length - 1;

      return '<div class="test-shell">' +
        CC.view.nav('select') +
        '<div class="test-top">' +
          '<button class="btn btn--ghost btn--sm" data-go="select">退出</button>' +
          '<span class="idx mono">第 <strong>' + String(t.index + 1).padStart(2, '0') + '</strong> / ' + t.set.length + ' 版</span>' +
          '<div class="pdots" id="pdots">' + t.set.map(function (_, i) {
            return '<span class="' + pdotClass(i) + '" data-jump="' + i + '" title="第 ' + (i + 1) + ' 版"></span>';
          }).join('') + '</div>' +
          '<div class="spacer"></div>' +
          '<span class="mono muted" id="clock">' + elapsed() + '</span>' +
        '</div>' +

        '<div class="plate-body">' +
          '<div class="plate-stage">' +
            '<div class="plate-frame">' +
              '<span class="tag-plate">PLATE ' + String(q.plate).padStart(2, '0') + '</span>' +
              '<canvas id="plate-canvas" role="img" aria-label="第 ' + q.plate + ' 版石原氏检测图"></canvas>' +
            '</div>' +
            '<p class="plate-cap">读出图中的数字。读不出就选「看不清」，不要长时间盯着猜。</p>' +
          '</div>' +

          '<aside class="plate-side">' +
            '<div class="card card--pad">' +
              '<div class="row row--between"><span class="chip chip--brand">' + CC.typeLabel[q.type] + '</span><span class="mono muted" style="font-size:12px">难度 ' + '●'.repeat(q.difficulty) + '</span></div>' +
              '<p class="muted" style="font-size:13px;margin-top:12px">' + ({
                demonstration: '演示题：所有人都能读出，用来确认你理解了题目要求。',
                normal: '常规题：正常色觉可直接读出数字。',
                transformation: '转换题：色觉异常者会读出另一个数字，用于判断异常类型。',
                vanishing: '消失题：正常色觉可见，异常色觉读不出任何数字。',
                hidden: '隐藏题：正常色觉看不出数字，异常色觉反而能读出。',
                classification: '分类题：红色盲与绿色盲会读出不同结果，用于区分类型。'
              })[q.type] + '</p>' +
            '</div>' +

            '<div class="answer-display ' + (buf ? '' : 'is-empty') + '" id="answer-display">' + (buf || '输入数字') + '</div>' +

            '<div class="keypad" id="keypad">' +
              ['1','2','3','4','5','6','7','8','9'].map(function (n) {
                return '<button class="key" data-key="' + n + '">' + n + '</button>';
              }).join('') +
              '<button class="key" data-key="0">0</button>' +
              '<button class="key" data-key="bs">←</button>' +
              '<button class="key key--act" data-key="ok">' + (isLast ? '提交' : '确认') + '</button>' +
              '<button class="key key--wide" data-key="none">看不清 / 没有数字</button>' +
            '</div>' +

            (q.type === 'demonstration' && rec
              ? '<div class="demo-feedback"><span class="chip ' + (rec.correct ? 'chip--ok' : 'chip--risk') + '">' +
                  (rec.correct ? '正确' : '再看一次') + '</span>' +
                  '<span>本版标准答案为 <strong class="mono">' + (q.answer || '无数字') + '</strong>' +
                  (rec.correct ? '，你可以继续。' : '。演示题用于确认你理解了要求，请再看一遍。') + '</span></div>'
              : '') +

            '<div class="row row--between">' +
              '<button class="btn btn--ghost btn--sm" data-act="prev"' + (t.index === 0 ? ' disabled' : '') + '>上一版</button>' +
              '<span class="muted" style="font-size:12px">支持键盘 <span class="kbd">0-9</span> <span class="kbd">Enter</span> <span class="kbd">←</span></span>' +
              '<button class="btn btn--secondary btn--sm" data-act="skip"' + (isLast ? ' disabled' : '') + '>跳过</button>' +
            '</div>' +
          '</aside>' +
        '</div>' +
        '</div>';
    },

    mount: function (root) {
      var t = CC.state.test;
      var q = t.set[t.index];

      CC.renderPlate(root.querySelector('#plate-canvas'), {
        text: q.answer || q.protan || '', type: q.type, seed: q.plate,
        cvd: 'none', animate: true
      });

      var disp = root.querySelector('#answer-display');
      t.enterAt = Date.now();
      var timer = setInterval(function () {
        var c = root.querySelector('#clock');
        if (c) c.textContent = elapsed();
      }, 1000);

      function setBuf(v) {
        CC.state.buffer = v.slice(0, 2);
        disp.textContent = CC.state.buffer || '输入数字';
        disp.classList.toggle('is-empty', !CC.state.buffer);
      }
      setBuf(CC.state.buffer || '');

      /** 记录答案 */
      function commit(value, cannotSee) {
        var dur = Date.now() - (t.enterAt || Date.now());
        var correct = cannotSee ? q.answer === '' : (value === q.answer && q.answer !== '');
        t.answers[q.id] = {
          questionId: q.id, userAnswer: cannotSee ? '' : value,
          cannotSee: !!cannotSee, durationMs: dur, correct: correct,
          timestamp: new Date().toISOString()
        };
        CC.state.buffer = '';
      }

      function advance() {
        clearInterval(timer);
        if (t.index < t.set.length - 1) {
          t.index++;
          CC.go('ishihara');
        } else {
          CC.finishTest();
        }
      }

      root.querySelector('#keypad').addEventListener('click', function (e) {
        var b = e.target.closest('[data-key]');
        if (!b) return;
        var k = b.getAttribute('data-key');
        if (k === 'bs') setBuf((CC.state.buffer || '').slice(0, -1));
        else if (k === 'none') { commit('', true); advance(); }
        else if (k === 'ok') { commit(CC.state.buffer || '', false); advance(); }
        else setBuf((CC.state.buffer || '') + k);
      });

      CC.state._keyHandler = function (e) {
        if (e.key >= '0' && e.key <= '9') setBuf((CC.state.buffer || '') + e.key);
        else if (e.key === 'Backspace') setBuf((CC.state.buffer || '').slice(0, -1));
        else if (e.key === 'Enter') { commit(CC.state.buffer || '', false); advance(); }
      };
      document.addEventListener('keydown', CC.state._keyHandler);

      root.querySelectorAll('[data-jump]').forEach(function (el) {
        el.addEventListener('click', function () {
          clearInterval(timer);
          t.index = +el.getAttribute('data-jump');
          CC.go('ishihara');
        });
      });
      var prev = root.querySelector('[data-act="prev"]');
      var skip = root.querySelector('[data-act="skip"]');
      if (prev) prev.addEventListener('click', function () { clearInterval(timer); t.index--; CC.go('ishihara'); });
      if (skip) skip.addEventListener('click', function () { clearInterval(timer); t.index++; CC.go('ishihara'); });
    },

    unmount: function () {
      document.removeEventListener('keydown', CC.state._keyHandler);
    }
  };
})();
