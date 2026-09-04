/* prototype/assets/js/app.js v0.1.0 — 原型外壳：状态 / 路由 / 设备与色觉模拟 / 判读串联 */
window.CC = window.CC || {};

(function () {
  'use strict';

  var W = { desktop: 1440, tablet: 834, mobile: 390 };

  CC.state = {
    route: 'home', device: 'desktop', theme: 'light', cvd: 'none', cvdSafe: 'off',
    mode: 'standard', guideReady: false, cat: '全部', articleIdx: 0,
    history: CC.history.slice(),
    test: { set: [], index: 0, answers: {}, start: 0 },
    path: { index: 0, results: [] },
    hue: { order: CC.hueShuffled.slice(), pick: null },
    result: null, lastAnswers: null, hueResult: null, buffer: ''
  };

  var q = function (id) { return document.getElementById(id); };

  /* ---------- 轻提示 ---------- */
  CC.toast = function (msg) {
    var stack = q('toast-stack');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span>✓</span><span>' + msg + '</span>';
    stack.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; }, 2400);
    setTimeout(function () { el.remove(); }, 2800);
  };

  /* ---------- 路由 ---------- */
  CC.go = function (route) {
    var prev = CC.screens[CC.state.route];
    if (prev && prev.unmount) prev.unmount();
    CC.state.route = route;
    CC.rerender();
  };

  CC.rerender = function () {
    var s = CC.screens[CC.state.route];
    if (!s) return;
    var root = q('frame');
    root.innerHTML = s.render();
    if (s.mount) s.mount(root);
    q('routeSel').value = CC.state.route;
    document.title = s.title + ' · 色辨 ChromaCheck 原型 v0.1.0';
    fit();
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  /* ---------- 自适应缩放 ---------- */
  function fit() {
    var f = q('frame');
    var w = W[CC.state.device];
    var room = window.innerWidth - (CC.state.device === 'mobile' ? 24 : 48);
    f.style.zoom = Math.min(1, room / w) || 1;
  }

  /* ---------- 检测流程 ---------- */
  CC.startTest = function (mode) {
    CC.state.mode = mode;
    CC.state.test = {
      set: mode === 'quick' ? CC.questions.filter(function (x) { return x.quick; }) : CC.questions.slice(),
      index: 0, answers: {}, start: Date.now()
    };
    CC.state.path = { index: 0, results: [] };
    CC.state.hue = { order: CC.hueShuffled.slice(), pick: null };
    CC.state.hueResult = null;
    CC.state.buffer = '';
  };

  CC.finishTest = function () {
    var t = CC.state.test;
    var byId = {};
    t.set.forEach(function (x) { byId[x.id] = x; });
    var answers = t.set.map(function (qq) {
      var rec = t.answers[qq.id] || { questionId: qq.id, userAnswer: '', cannotSee: true, durationMs: 0 };
      rec.correct = CC.isCorrect(qq, rec.userAnswer);
      return rec;
    });
    var ish = CC.scoreIshihara(answers, t.set);
    var now = new Date();
    var res = {
      id: 'cc-' + String(now.getTime()).slice(-6),
      mode: CC.state.mode,
      startTime: new Date(t.start).toISOString(),
      endTime: now.toISOString(),
      device: '原型演示 · ' + navigator.platform + ' · ' + window.innerWidth + '×' + window.innerHeight,
      ishihara: ish
    };
    if (CC.state.mode === 'advanced') {
      res.pathTracking = CC.state.path.results.filter(Boolean);
      res.hueArrangement = CC.state.hueResult || { totalErrorScore: 0, deviationDirection: 'none', normal: true };
    }
    CC.state.result = res;
    CC.state.lastAnswers = answers;
    CC.state.history.unshift({
      id: res.id, date: res.endTime, mode: res.mode, overall: ish.overall,
      type: ish.type, severity: ish.severity, confidence: ish.confidence,
      dims: [ish.dimensions.protan, ish.dimensions.deutan, ish.dimensions.tritan]
    });
    CC.go('result');
  };

  /* ---------- 色觉模拟滤镜 ---------- */
  var FILTERS = [
    ['protanopia', '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0'],
    ['deuteranopia', '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0'],
    ['tritanopia', '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0'],
    ['achromatopsia', '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0']
  ];
  function injectFilters() {
    var svg = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
      FILTERS.map(function (f) {
        return '<filter id="cc-cvd-' + f[0] + '" color-interpolation-filters="linearRGB">' +
          '<feColorMatrix type="matrix" values="' + f[1] + '"/></filter>';
      }).join('') + '</defs></svg>';
    document.body.insertAdjacentHTML('afterbegin', svg);
  }
  function applyCvd() {
    var f = q('frame');
    f.style.filter = CC.state.cvd === 'none' ? '' : 'url(#cc-cvd-' + CC.state.cvd + ')';
  }

  /* ---------- 交互委派 ---------- */
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) {
      var r = go.getAttribute('data-go');
      if (r === 'learnDetail') CC.state.articleIdx = +go.getAttribute('data-idx') || 0;
      CC.go(r);
      return;
    }
    var t = e.target.closest('[data-act="toast"]');
    if (t) CC.toast(t.getAttribute('data-msg'));
  });

  /* ---------- 外壳控件 ---------- */
  function bindChrome() {
    var sel = q('routeSel');
    CC.routes.forEach(function (r) {
      var o = document.createElement('option');
      o.value = r.key; o.textContent = r.group + ' · ' + r.label;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () { CC.go(sel.value); });

    ['desktop', 'tablet', 'mobile'].forEach(function (d) {
      var b = q('btn-' + d);
      b.addEventListener('click', function () {
        CC.state.device = d;
        q('frame').setAttribute('data-device', d);
        q('frame').style.setProperty('--frame-w', W[d] + 'px');
        ['desktop', 'tablet', 'mobile'].forEach(function (x) { q('btn-' + x).classList.toggle('is-on', x === d); });
        CC.rerender();
      });
    });

    q('btn-theme').addEventListener('click', function () {
      CC.state.theme = CC.state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', CC.state.theme);
      this.classList.toggle('is-on', CC.state.theme === 'dark');
      this.textContent = CC.state.theme === 'dark' ? '深色' : '浅色';
    });

    q('sel-cvd').addEventListener('change', function () {
      CC.state.cvd = this.value;
      applyCvd();
      CC.toast('已切换色觉模拟：' + this.options[this.selectedIndex].text);
    });

    q('btn-safe').addEventListener('click', function () {
      CC.state.cvdSafe = CC.state.cvdSafe === 'on' ? 'off' : 'on';
      document.documentElement.setAttribute('data-cvd-safe', CC.state.cvdSafe);
      this.classList.toggle('is-on', CC.state.cvdSafe === 'on');
      CC.rerender();
    });

    q('btn-reset').addEventListener('click', function () {
      CC.state.history = CC.history.slice();
      CC.state.result = null; CC.state.lastAnswers = null;
      CC.state.guideReady = false; CC.state.buffer = '';
      CC.state.test = { set: [], index: 0, answers: {}, start: 0 };
      CC.go('home');
      CC.toast('原型状态已重置');
    });

    window.addEventListener('resize', fit);
  }

  /* ---------- 启动 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    injectFilters();
    bindChrome();
    q('frame').setAttribute('data-device', 'desktop');
    q('frame').style.setProperty('--frame-w', W.desktop + 'px');
    q('btn-desktop').classList.add('is-on');
    var hash = (location.hash || '').replace('#', '');
    CC.state.route = CC.screens[hash] ? hash : 'home';
    CC.rerender();
  });
})();
