/* prototype/assets/js/interaction.js v0.1.0 — 交互标准页：可交互示例驱动 */
(function () {
  'use strict';

  var ICON = {
    'err-ic': 'alert-circle', 'done-ic': 'check-circle', 'confirm-ic': 'check-circle',
    'modal-ic': 'alert-triangle', 'net-ic': 'wifi', 'empty-hist-ic': 'history',
    'empty-first-ic': 'play', 'empty-filter-ic': 'search', 'empty-offline-ic': 'wifi'
  };

  function injectIcons() {
    Object.keys(ICON).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && window.CC && CC.icon) el.innerHTML = CC.icon(ICON[id]);
    });
  }

  /* 标签切换 */
  function initTabs() {
    var nav = document.getElementById('tabs-nav');
    if (!nav) return;
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      var id = b.getAttribute('data-tab');
      nav.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('is-active', t === b); });
      document.querySelectorAll('.tab-panel').forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-panel') === id);
      });
    });
  }

  /* 数字键盘 */
  function initKeypad() {
    var kp = document.getElementById('kp');
    var disp = document.getElementById('kp-display');
    if (!kp || !disp) return;
    var val = '';
    kp.addEventListener('click', function (e) {
      var b = e.target.closest('.key'); if (!b) return;
      var k = b.getAttribute('data-k');
      if (k === 'del') val = val.slice(0, -1);
      else if (k === 'ok') { if (val) showToast('info', '已提交答案：' + val); val = ''; }
      else if (val.length < 3) val += k;
      disp.textContent = val || '—';
    });
  }

  /* 单选芯片 */
  function initChips() {
    var row = document.getElementById('mode-chips');
    if (!row) return;
    row.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      row.querySelectorAll('.chip').forEach(function (c) {
        var on = c === b;
        c.classList.toggle('is-sel', on);
        c.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    });
  }

  /* 骨架加载 */
  function initSkeleton() {
    var btn = document.getElementById('btn-skel2');
    var el = document.getElementById('skel2');
    if (!btn || !el) return;
    btn.addEventListener('click', function () {
      el.classList.add('is-on');
      setTimeout(function () { el.classList.remove('is-on'); }, 1800);
    });
  }

  /* Toast */
  var TOAST_ICON = { ok: 'check-circle', info: 'info', warn: 'alert-triangle', risk: 'x-circle' };
  var TOAST_TXT = { ok: '设置已保存', info: '已提交答案', warn: '部分题目未作答', risk: '保存失败，请重试' };
  function showToast(type, text) {
    var stack = document.getElementById('toast-stack');
    if (!stack) return;
    var t = document.createElement('div');
    t.className = 'toast toast--' + type + ' pop';
    t.innerHTML = (CC.icon ? CC.icon(TOAST_ICON[type]) : '') + '<span>' + (text || TOAST_TXT[type]) + '</span>';
    stack.appendChild(t);
    setTimeout(function () {
      t.classList.add('toast-out');
      setTimeout(function () { t.remove(); }, 280);
    }, 4000);
  }
  function initToasts() {
    document.querySelectorAll('[data-toast]').forEach(function (b) {
      b.addEventListener('click', function () { showToast(b.getAttribute('data-toast')); });
    });
  }

  /* 进度 + 完成 */
  function initProgress() {
    var btn = document.getElementById('btn-prog2');
    var fill = document.getElementById('bar-fill2');
    var done = document.getElementById('done-line');
    if (!btn || !fill) return;
    btn.addEventListener('click', function () {
      fill.style.width = '0%'; done.hidden = true; void fill.offsetWidth;
      fill.style.width = '100%';
      setTimeout(function () { done.hidden = false; }, 1000);
    });
  }

  /* 即时确认 */
  function initConfirm() {
    var btn = document.getElementById('btn-confirm');
    var line = document.getElementById('confirm-line');
    if (!btn || !line) return;
    btn.addEventListener('click', function () { line.hidden = false; });
  }

  /* 阻断式错误模态 */
  function initErrorModal() {
    var open = document.getElementById('btn-err-modal');
    var mask = document.getElementById('err-modal');
    var close = document.getElementById('btn-err-close');
    var retry = document.getElementById('btn-err-retry');
    if (!open || !mask) return;
    function show() { mask.hidden = false; }
    function hide() { mask.hidden = true; }
    open.addEventListener('click', show);
    if (close) close.addEventListener('click', hide);
    if (retry) retry.addEventListener('click', function () { hide(); showToast('ok', '已重试'); });
    mask.addEventListener('click', function (e) { if (e.target === mask) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mask.hidden) hide(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectIcons();
    initTabs();
    initKeypad();
    initChips();
    initSkeleton();
    initToasts();
    initProgress();
    initConfirm();
    initErrorModal();
  });
})();
