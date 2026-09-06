/* prototype/assets/js/screens-test.js v0.1.3 — 石原氏数字图检测屏（可真实作答 / 章末过渡 / 中性反馈） */
window.CC = window.CC || {};
CC.screens = CC.screens || {};

(function () {
  'use strict';
  var esc = CC.view.esc;

  function pdotClass(i) {
    /* 进度点阵只表达「已完成 / 当前 / 未到」，不暴露对错（防答题数据污染） */
    if (i === CC.state.test.index) return 'pdot is-current';
    return CC.state.test.answers[CC.state.test.set[i].id] ? 'pdot is-done' : 'pdot';
  }

  function elapsed() {
    var s = Math.floor((Date.now() - CC.state.test.start) / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  CC.screens.ishihara = {
    title: '石原氏测试',
    render: function () {
      var t = CC.state.test;

      /* 章末过渡卡（趣味体验开启时，章节交替处插入轻科普） */
      if (t.pauseChapter != null) {
        var ch = CC.chapters[t.pauseChapter];
        return '<div class="test-shell">' +
          CC.view.nav('select') +
          '<div class="chapter-card rise" id="chapter-card" role="status" aria-label="章节过渡">' +
            '<span class="chapter-card__ic">' + ch.icon + '</span>' +
            '<p class="eyebrow">第 ' + (t.pauseChapter + 1) + ' / 3 章</p>' +
            '<h2>' + ch.name + '</h2>' +
            '<p class="soft">' + ch.copy + '</p>' +
            '<div class="pdots chapter-pdots">' + t.set.map(function (_, i) {
              return '<span class="' + pdotClass(i) + '"></span>';
            }).join('') + '</div>' +
            '<button class="btn btn--primary btn--lg" id="ch-go">继续检测</button>' +
            '<span class="muted" style="font-size:12px;margin-top:12px">回车键也可继续</span>' +
          '</div>' +
          '</div>';
      }

      var q = t.set[t.index];
      var rec = t.answers[q.id];
      var buf = CC.state.buffer || '';
      var isLast = t.index === t.set.length - 1;

      return '<div class="test-shell">' +
        CC.view.nav('select') +
        '<div class="test-top">' +
          '<button class="btn btn--ghost btn--sm" data-go="select">退出</button>' +
          '<span class="idx mono">第 <strong>' + String(t.index + 1).padStart(2, '0') + '</strong> / ' + t.set.length + ' 版</span>' +
          '<div class="pdots' + (t.pulse ? ' is-milestone' : '') + '" id="pdots">' + t.set.map(function (_, i) {
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

      /* 章末过渡卡：继续按钮 + 回车继续 */
      if (t.pauseChapter != null) {
        function goOn() {
          document.removeEventListener('keydown', CC.state._keyHandler);
          t.pauseChapter = null;
          CC.go('ishihara');
        }
        CC.state._keyHandler = function (e) { if (e.key === 'Enter') goOn(); };
        document.addEventListener('keydown', CC.state._keyHandler);
        root.querySelector('#ch-go').addEventListener('click', goOn);
        return;
      }

      var q = t.set[t.index];

      var drawPlate = function () {
        CC.renderPlate(root.querySelector('#plate-canvas'), {
          text: q.answer || q.protan || '', type: q.type, seed: q.plate,
          cvd: 'none', animate: true
        });
      };
      /* 等字体就绪再绘制数字蒙版，避免 Archivo 未加载导致点阵数字变形（FOUT） */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawPlate);
      else drawPlate();

      var disp = root.querySelector('#answer-display');
      t.enterAt = Date.now();
      t.pulse = false;
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
        t.locked = false;
        if (t.index < t.set.length - 1) {
          var nextQ = t.set[t.index + 1];
          if (CC.fun() && CC.chapterOf(q.type) !== CC.chapterOf(nextQ.type)) {
            t.index++;
            t.pauseChapter = CC.chapterOf(nextQ.type);
            CC.go('ishihara');
            return;
          }
          t.index++;
          CC.go('ishihara');
        } else if (CC.state.mode === 'advanced') {
          CC.go('path');
        } else {
          CC.finishTest();
        }
      }

      /** 提交一题：记录 → 中性反馈（✓ 已记录，无对错信息）→ 里程碑仪式感 → 推进 */
      function submit(value, cannotSee) {
        if (t.locked) return;
        commit(value, cannotSee);
        t.locked = true;
        disp.innerHTML = '<span class="commit-ok">✓ 已记录</span>';
        disp.classList.remove('is-empty');
        var answered = Object.keys(t.answers).length;
        if (CC.fun() && answered > 0 && answered % 8 === 0 && answered < t.set.length) {
          CC.toast('已完成 ' + answered + ' / ' + t.set.length + ' 版');
          t.pulse = true;
        }
        setTimeout(advance, 420);
      }

      root.querySelector('#keypad').addEventListener('click', function (e) {
        var b = e.target.closest('[data-key]');
        if (!b) return;
        var k = b.getAttribute('data-key');
        if (t.locked) return;
        if (k === 'bs') setBuf((CC.state.buffer || '').slice(0, -1));
        else if (k === 'none') submit('', true);
        else if (k === 'ok') submit(CC.state.buffer || '', false);
        else setBuf((CC.state.buffer || '') + k);
      });

      CC.state._keyHandler = function (e) {
        if (t.locked) return;
        if (e.key >= '0' && e.key <= '9') setBuf((CC.state.buffer || '') + e.key);
        else if (e.key === 'Backspace') setBuf((CC.state.buffer || '').slice(0, -1));
        else if (e.key === 'Enter') submit(CC.state.buffer || '', false);
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
