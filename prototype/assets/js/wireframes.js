/* prototype/assets/js/wireframes.js v0.1.0 — 组件库规范页：目录渲染 + demo 激活 + 轻量 toast/modal */
(function () {
  'use strict';
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var GROUPS = ['基础组件', '复合组件', '业务组件'];

  function buildTOC() {
    var data = window.CC_CATALOG || [];
    var html = '';
    GROUPS.forEach(function (g) {
      var items = data.filter(function (c) { return c.group === g; });
      if (!items.length) return;
      html += '<div class="g">' + g + '</div>';
      items.forEach(function (c) {
        html += '<a href="#comp-' + c.id + '" data-toc="comp-' + c.id + '">' + c.name + '</a>';
      });
    });
    html += '<div class="g">规范</div>';
    html += '<a href="#sec-rules" data-toc="sec-rules">组件使用总规则</a>';
    html += '<a href="#sec-a11y" data-toc="sec-a11y">无障碍基线</a>';
    q('#lib-toc').innerHTML = html;
  }

  function section(c) {
    var spec = (c.spec || []).map(function (r) {
      return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>';
    }).join('');
    var dos = (c.rules && c.rules.do || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
    var donts = (c.rules && c.rules.dont || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
    return '<section class="lib-sec" id="comp-' + c.id + '">' +
      '<h2><span>' + c.name + '</span> <small>' + c.en + ' · ' + c.group + '</small></h2>' +
      '<p class="lib-desc">' + c.desc + '</p>' +
      '<div class="demo-stage"><div class="demo-label">预览</div>' + c.demo + '</div>' +
      '<h3 class="spec-h">规格</h3>' +
      '<table class="spec-table"><tbody>' + spec + '</tbody></table>' +
      (dos || donts ? '<div class="do-dont">' +
        (dos ? '<div class="d ok"><h5>✓ 应该做</h5><ul>' + dos + '</ul></div>' : '') +
        (donts ? '<div class="d no"><h5>✗ 不要做</h5><ul>' + donts + '</ul></div>' : '') + '</div>' : '') +
      (c.a11y ? '<p class="a11y"><b>♿ 无障碍：</b>' + c.a11y + '</p>' : '') + '</section>';
  }

  function buildSections() {
    var data = window.CC_CATALOG || [];
    var html = data.filter(function (c) { return GROUPS.indexOf(c.group) >= 0; })
      .map(section).join('');
    html += rulesSection() + a11ySection();
    q('#lib-content').innerHTML = html;
  }

  function rulesSection() {
    return '<section class="lib-sec" id="sec-rules"><h2><span>组件使用总规则</span> <small>Principles</small></h2>' +
      '<p class="lib-desc">所有页面共享同一套组件与令牌，遵循以下四条原则，保证视觉与交互的一致。</p>' +
      '<div class="grid grid-2" style="margin-top:var(--s-5)">' +
      rule('单一主行动', '每屏至多一个主按钮，承载用户最可能做的那件事；其余降级为次级或幽灵按钮。') +
      rule('状态可感知', '每个状态（默认/悬停/禁用/选中/报错）都有颜色、文字或图标三选一的明确表达，绝不单靠颜色。') +
      rule('容器加语义 id', '主要容器、卡片根节点、关键 DOM 一律带语义化 id，便于测试定位与无障碍锚点。') +
      rule('动效有节制', '过渡统一 200–760ms 缓动，仅用于引导注意力，不制造等待焦虑。') +
      '</div></section>';
  }
  function rule(t, d) {
    return '<div class="card card--pad"><h4>' + t + '</h4><p class="muted" style="margin-top:8px;font-size:13px">' + d + '</p></div>';
  }

  function a11ySection() {
    var items = [
      ['键盘可达', '所有交互元素可 Tab 聚焦，Enter/Space 触发，焦点环 3px 且对比度 ≥ 3:1。'],
      ['读屏友好', '图标按钮带 aria-label；图表/画布带 role="img" 与文字说明；动态区域用 aria-live。'],
      ['色彩非唯一', '状态除颜色外必配文字或图标；提供「色觉友好配色」开关（蓝—青—琥珀替代红—绿）。'],
      ['目标尺寸', '触摸目标不小于 40×40；指针与键盘双通道完成所有任务，不强制拖拽。'],
      ['对比度', '正文与背景对比度 ≥ 4.5:1，大字 ≥ 3:1，符合 WCAG AA。']
    ];
    return '<section class="lib-sec" id="sec-a11y"><h2><span>无障碍基线</span> <small>Accessibility</small></h2>' +
      '<p class="lib-desc">色觉检测产品本身服务于视觉差异人群，无障碍是底线而非加分项。</p>' +
      '<table class="spec-table" style="margin-top:var(--s-5)"><tbody>' +
      items.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') +
      '</tbody></table></section>';
  }

  /* ---------------- demo 激活 ---------------- */
  function initDemos() {
    var pc = q('#demo-plate-canvas');
    if (pc && window.CC && CC.renderPlate) {
      pc.width = 600; pc.height = 600;
      CC.renderPlate(pc, { text: '6', type: 'transformation', seed: 3, cvd: 'none', animate: true });
    }
    qa('[data-demo-toggle]').forEach(function (b) {
      b.addEventListener('click', function () { b.classList.toggle('is-on'); });
    });
    qa('[data-demo-toast]').forEach(function (b) {
      b.addEventListener('click', function () { myToast('已触发一条轻提示'); });
    });
    qa('[data-demo-modal]').forEach(function (b) {
      b.addEventListener('click', function () { openModal(); });
    });
    qa('#demo-tabs').forEach(function (box) {
      box.addEventListener('click', function (e) {
        var t = e.target.closest('[data-tab]'); if (!t) return;
        qa('[data-tab]', box).forEach(function (x) {
          x.style.borderBottom = x === t ? '2px solid var(--brand)' : '2px solid transparent';
        });
      });
    });
    initPath(); initHue(); initKeypad();
  }

  function initPath() {
    var pf = q('#demo-path-canvas'); if (!pf || !window.CC) return;
    pf.width = 700; pf.height = 520;
    var base = CC.renderPathField(pf, { seed: 1, kind: 0, cvd: 'none', pathColor: '#c4553b' });
    var wrap = pf.parentNode; wrap.style.position = 'relative';
    var ov = document.createElement('canvas');
    ov.width = 700; ov.height = 520;
    ov.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;touch-action:none;cursor:crosshair';
    wrap.appendChild(ov);
    var octx = ov.getContext('2d'), drawing = false, pts = [];
    function pos(e) {
      var r = ov.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      var cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      return { x: cx / r.width, y: cy / r.height };
    }
    function seg(a, b) {
      octx.strokeStyle = 'rgba(16,22,30,.92)'; octx.lineWidth = 9; octx.lineCap = 'round';
      octx.beginPath(); octx.moveTo(a.x * 700, a.y * 520); octx.lineTo(b.x * 700, b.y * 520); octx.stroke();
    }
    function add(e) { var p = pos(e); pts.push(p); if (pts.length > 1) seg(pts[pts.length - 2], p); update(); }
    function down(e) { drawing = true; pts = []; octx.clearRect(0, 0, 700, 520); add(e); e.preventDefault(); }
    function move(e) { if (drawing) { add(e); e.preventDefault(); } }
    function up() { drawing = false; }
    ov.addEventListener('mousedown', down); ov.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    ov.addEventListener('touchstart', down, { passive: false });
    ov.addEventListener('touchmove', move, { passive: false }); ov.addEventListener('touchend', up);
    function update() {
      var sp = base.path, hit = 0;
      for (var i = 0; i < sp.length; i++)
        if (pts.some(function (p) { return Math.hypot(p.x - sp[i].x, p.y - sp[i].y) < 0.055; })) hit++;
      var rd = q('#demo-path-read');
      if (rd) rd.textContent = (pts.length ? Math.round(hit / sp.length * 100) : 0) + '%';
    }
    var btn = document.createElement('button');
    btn.className = 'btn btn--ghost btn--sm'; btn.textContent = '清除重画'; btn.style.marginTop = '10px';
    btn.addEventListener('click', function () { octx.clearRect(0, 0, 700, 520); pts = []; var rd = q('#demo-path-read'); if (rd) rd.textContent = '0%'; });
    wrap.parentNode.insertBefore(btn, wrap.nextSibling);
  }

  function initHue() {
    var rail = q('#demo-hue-rail'); if (!rail) return;
    var N = 15, base = [];
    for (var i = 0; i < N; i++) base.push('hsl(' + Math.round(360 * i / N) + ',62%,55%)');
    var order = base.slice(), selected = null;
    for (var j = order.length - 1; j > 0; j--) { var k = (j * 7) % (j + 1), t = order[j]; order[j] = order[k]; order[k] = t; }
    function render() {
      var html = '<span class="hue-card hue-card--fixed" data-fixed="1" style="background:#2a2f37"></span>';
      html += order.map(function (c, i) {
        return '<span class="hue-card' + (selected === i ? ' is-sel' : '') + '" data-idx="' + i + '" style="background:' + c + '"><i>' + (i + 1) + '</i></span>';
      }).join('');
      html += '<span class="hue-card hue-card--fixed" data-fixed="1" style="background:#e9e2d2"></span>';
      rail.innerHTML = html;
    }
    rail.addEventListener('click', function (e) {
      var c = e.target.closest('[data-idx]'); if (!c) return;
      var i = +c.dataset.idx;
      if (selected === null) { selected = i; }
      else if (selected === i) { selected = null; }
      else { var tmp = order[selected]; order[selected] = order[i]; order[i] = tmp; selected = null; }
      render();
    });
    render();
  }

  function initKeypad() {
    var kp = q('#demo-keypad'), ans = q('#demo-answer'); if (!kp || !ans) return;
    kp.addEventListener('click', function (e) {
      var b = e.target.closest('.key'); if (!b) return;
      var k = b.dataset.k, cur = ans.textContent;
      if (k === 'bs') ans.textContent = cur === '输入数字' ? cur : cur.slice(0, -1) || '输入数字';
      else if (k === 'ok') ans.textContent = cur === '输入数字' ? cur : '已确认 ✓';
      else if (k === 'none') ans.textContent = '看不清';
      else { if (cur === '输入数字') cur = ''; if (cur.length < 2) ans.textContent = cur + k; }
    });
  }

  /* ---------------- 轻量 toast / modal ---------------- */
  function myToast(msg) {
    var stack = q('#toast-stack');
    if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; stack.id = 'toast-stack'; document.body.appendChild(stack); }
    var el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = '<span>✓</span><span>' + msg + '</span>';
    stack.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; }, 2400);
    setTimeout(function () { el.remove(); }, 2800);
  }
  function openModal() {
    var mask = document.createElement('div'); mask.className = 'modal-mask';
    mask.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true" aria-label="清空确认">' +
      '<h3 style="margin:0 0 8px">清空全部历史记录</h3>' +
      '<p class="muted" style="font-size:14px;margin:0 0 20px">此操作不可撤销，确定要删除所有检测记录吗？</p>' +
      '<div class="row" style="gap:10px;justify-content:flex-end">' +
      '<button class="btn btn--ghost" data-m="cancel">取消</button>' +
      '<button class="btn btn--danger" data-m="ok">确认清空</button></div></div>';
    document.body.appendChild(mask);
    function close() { mask.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    mask.addEventListener('click', function (e) {
      if (e.target === mask || e.target.dataset.m === 'cancel') close();
      else if (e.target.dataset.m === 'ok') { myToast('记录已清空'); close(); }
    });
    document.addEventListener('keydown', onKey);
  }

  /* ---------------- 导航高亮 ---------------- */
  function initSpy() {
    var links = qa('#lib-toc a'); if (!links.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('is-active', l.dataset.toc === en.target.id); });
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    qa('#lib-content .lib-sec, #sec-rules, #sec-a11y').forEach(function (s) { io.observe(s); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildTOC(); buildSections(); initDemos(); initSpy();
  });
})();
