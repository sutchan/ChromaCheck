/* prototype/assets/js/screens-main.js v0.1.2 — 视图骨架 / 首页 / 检测前指引 / 模式选择 */
window.CC = window.CC || {};
CC.screens = CC.screens || {};

(function () {
  'use strict';

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* ---------- 共享骨架 ---------- */
  CC.view = {
    esc: esc,

    nav: function (active) {
      var links = [
        ['home', '首页'], ['select', '开始检测'], ['learn', '色觉科普'], ['history', '历史记录']
      ];
      return '<header class="navbar" id="app-navbar">' +
        '<div class="logo" data-go="home"><span class="logo__dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>色辨 ChromaCheck</div>' +
        '<nav>' + links.map(function (l) {
          return '<a data-go="' + l[0] + '" class="' + (active === l[0] ? 'is-active' : '') + '">' + l[1] + '</a>';
        }).join('') + '</nav>' +
        '<div class="spacer"></div>' +
        '<button class="btn btn--ghost btn--sm" data-act="toast" data-msg="设置面板在实现版本中提供：音效、自动下一题、主题">设置</button>' +
        '<button class="btn btn--primary btn--sm" data-go="guide">开始检测</button>' +
        '</header>';
    },

    footer: function () {
      return '<footer class="footer"><div class="cols">' +
        '<div><div class="logo" style="margin-bottom:12px"><span class="logo__dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>色辨 ChromaCheck</div>' +
        '<p class="muted" style="font-size:13px;max-width:34ch">在线色觉筛查工具。结果仅供参考，不能替代专业医学诊断。</p></div>' +
        '<div><h5>检测</h5><ul><li data-go="select">石原氏数字图</li><li data-go="path">路径追踪</li><li data-go="hue">色相排列</li></ul></div>' +
        '<div><h5>了解</h5><ul><li data-go="learn">色觉科普</li><li data-go="history">历史记录</li><li data-act="toast" data-msg="隐私政策：数据默认仅存本地">隐私政策</li></ul></div>' +
        '<div><h5>更多</h5><ul><li data-act="toast" data-msg="意见反馈入口在实现版本中提供">意见反馈</li><li data-act="toast" data-msg="关于我们：依据 GB/T 27896-2011 设计">关于我们</li></ul></div>' +
        '</div><div class="legal"><span>© 2026 色辨 ChromaCheck · MIT License</span>' +
        '<span>原型 v0.1.0 · 依据 GB/T 27896-2011《色盲检查图》设计</span></div></footer>';
    },

    page: function (active, inner) {
      return CC.view.nav(active) + '<main>' + inner + '</main>' + CC.view.footer();
    },

    stat: function (num, label) {
      return '<div class="stat"><span class="stat__num">' + num + '</span><span class="stat__label">' + label + '</span></div>';
    }
  };

  /* ---------- 首页 ---------- */
  CC.screens.home = {
    title: '首页',
    render: function () {
      return CC.view.page('home',
        '<section class="hero">' +
          '<div>' +
            '<p class="eyebrow">Ishihara · Path tracing · Hue arrangement</p>' +
            '<h1 style="margin-top:14px">一眼辨色，<em>科学</em>筛查</h1>' +
            '<p class="lead">24 版标准石原氏色觉检测图，配合路径追踪形成交叉验证。色相排列（D15）为规划中模块，结果不计入判读。全程约 3 分钟，答题数据只留在你的浏览器里。</p>' +
            '<div class="cta-row">' +
              '<button class="btn btn--primary btn--lg" data-go="guide">开始检测</button>' +
              '<button class="btn btn--secondary btn--lg" data-go="result">看一份示例报告</button>' +
            '</div>' +
            '<div class="trust">' +
              '<div><p class="stat__num">24</p><p class="stat__label">标准图版</p></div>' +
              '<div><p class="stat__num">3<small style="font-size:14px"> 分钟</small></p><p class="stat__label">平均完成</p></div>' +
              '<div><p class="stat__num">0</p><p class="stat__label">需注册账号</p></div>' +
            '</div>' +
          '</div>' +
          '<div class="hero-plate">' +
            '<canvas id="hero-plate" aria-label="石原氏演示检测图"></canvas>' +
            '<p class="cap">第 1 版 · 演示图 —— 正常色觉应读出「12」</p>' +
          '</div>' +
        '</section>' +

        '<hr class="dot-rule" style="margin:0 var(--s-8)">' +

        '<section class="section">' +
          '<div class="section-head"><h2>三步拿到你的色觉画像</h2><p>从校准环境到读懂结果，不需要任何专业知识，也不需要任何设备。</p></div>' +
          '<div class="flow-3">' +
            '<div class="step"><h4>校准观看环境</h4><p>确认屏幕亮度、观看距离与室内光线，勾选准备就绪即可开始。</p></div>' +
            '<div class="step"><h4>读完 24 版检测图</h4><p>读出数字，或选择「看不清」。允许返回修改，不计时不限时。</p></div>' +
            '<div class="step"><h4>读取色觉画像</h4><p>得到类型、程度、置信度与逐题明细，可导出 PNG / PDF 报告。</p></div>' +
          '</div>' +
        '</section>' +

        '<section class="section section--sunken">' +
          '<div class="section-head"><h2>比纸质图谱更可靠的地方</h2><p>纸质图谱会磨损、受环境光影响，也无法记录你究竟错在哪一类题上。</p></div>' +
          '<div class="grid grid-4">' +
            '<div class="card card--pad feature"><div class="ic">◍</div><h4>等亮度点阵</h4><p>色点只差色相、明暗一致，避免靠亮度差异"猜"出数字。</p></div>' +
            '<div class="card card--pad feature"><div class="ic">⌁</div><h4>交叉验证</h4><p>数字图与路径追踪互相印证，单一测试误判不再放大；色相排列（D15）为规划中模块。</p></div>' +
            '<div class="card card--pad feature"><div class="ic">◫</div><h4>判读看错误模式</h4><p>不只统计对错，还看错误落在红轴还是绿轴，才推得出类型。</p></div>' +
            '<div class="card card--pad feature"><div class="ic">◒</div><h4>数据不出本机</h4><p>结果默认写入浏览器本地存储，可随时一键清除，不强制上传。</p></div>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<div class="section-head"><h2>先搞清楚几件事</h2><p>检测前的三分钟，比检测本身更影响结果。</p></div>' +
          '<div class="grid grid-3">' +
            '<div class="card card--pad"><p class="eyebrow">人群基线</p><div class="row row--between" style="margin-top:14px">' + CC.view.stat('8%', '男性色觉异常率') + CC.view.stat('0.5%', '女性色觉异常率') + '</div><p class="muted" style="margin-top:14px;font-size:13px">红绿色觉异常属 X 连锁隐性遗传，男性远高于女性。</p></div>' +
            '<div class="card card--pad"><p class="eyebrow">结果可信度</p><p style="margin-top:14px">答题过快、演示题答错、答案互相矛盾，都会降低置信度。低于 60 分时我们不会给结论。</p><p class="muted" style="margin-top:12px;font-size:13px">置信度 = 100 − 演示题错误 25 − 过快每题 2 − 矛盾 15</p></div>' +
            '<div class="card card--pad"><p class="eyebrow">它不能做什么</p><p style="margin-top:14px">屏幕色域、环境光、显示器老化都会影响结果。本工具是筛查，不是诊断。</p><div class="callout callout--warn" style="margin-top:14px">结果异常请到正规医院眼科做进一步检查。</div></div>' +
          '</div>' +
        '</section>' +

        '<section class="section section--sunken">' +
          '<div class="row row--between" style="margin-bottom:8px"><h2 style="font-size:var(--fs-h2)">色觉科普</h2><button class="btn btn--ghost btn--sm" data-go="learn">查看全部 6 篇 →</button></div>' +
          CC.articles.slice(0, 3).map(function (a, i) {
            return '<div class="article-row" data-go="learnDetail" data-idx="' + i + '">' +
              '<div class="article-row__thumb" style="background:' + a.hue + '"></div>' +
              '<div><p class="article-row__t">' + esc(a.title) + '</p><p class="article-row__m">' + a.cat + ' · 阅读 ' + a.read + '</p></div>' +
              '<span class="chip chip--outline">阅读</span></div>';
          }).join('') +
        '</section>' +

        '<section class="section" style="text-align:center;display:grid;gap:20px;justify-items:center">' +
          '<h2 style="font-size:var(--fs-h1)">现在知道自己看到的是哪种颜色</h2>' +
          '<p class="soft" style="max-width:52ch">不用注册，不用下载，打开就能测。</p>' +
          '<button class="btn btn--primary btn--lg" data-go="guide">开始检测</button>' +
        '</section>'
      );
    },
    mount: function (root) {
      var cv = root.querySelector('#hero-plate');
      if (!cv) return;
      var seq = ['12', '8', '74', '29'], i = 0;
      function draw() {
        CC.renderPlate(cv, {
          text: seq[i % seq.length], type: i % 2 ? 'transformation' : 'demonstration',
          seed: 1 + i, cvd: 'none', animate: true
        });
        i++;
      }
      draw();
      CC.state._heroTimer = setInterval(draw, 5200);
    },
    unmount: function () { clearInterval(CC.state._heroTimer); }
  };

  /* ---------- 检测前指引 ---------- */
  CC.screens.guide = {
    title: '检测前指引',
    render: function () {
      var ready = CC.state.guideReady;
      return CC.view.page('select',
        '<div class="guide-wrap">' +
          '<p class="eyebrow">Step 1 / 3</p>' +
          '<h1>开始前，请先校准你的观看环境</h1>' +
          '<p class="soft" style="margin-top:12px">色觉检测对环境非常敏感。下面四条做到位，结果才有参考价值。</p>' +

          '<div class="guide-visual">' +
            '<div class="v"><p class="big">50–70 cm</p><p class="small">眼睛到屏幕的距离</p></div>' +
            '<div class="v"><p class="big">自然光</p><p class="small">避免强光直射与屏幕反光</p></div>' +
            '<div class="v"><p class="big">100%</p><p class="small">建议屏幕亮度拉到最高</p></div>' +
          '</div>' +

          '<div class="guide-list">' +
            '<div class="guide-item"><span class="n">01</span><div><h4>不要戴有色眼镜或美瞳</h4><p>任何带颜色的镜片都会改变进入眼睛的光谱，直接影响判读。</p></div></div>' +
            '<div class="guide-item"><span class="n">02</span><div><h4>把屏幕亮度调到最高</h4><p>亮度不足会让色点变暗，等亮度设计失效，正常色觉也可能读不出数字。</p></div></div>' +
            '<div class="guide-item"><span class="n">03</span><div><h4>每题最多看 10 秒</h4><p>盯着太久会启动"联想式辨认"。第一反应最准，读不出就选「看不清」。</p></div></div>' +
            '<div class="guide-item"><span class="n">04</span><div><h4>全程约 3 分钟，可随时暂停</h4><p>进度会自动存在本机，中途关掉页面下次可继续。</p></div></div>' +
          '</div>' +

          '<label class="check" style="font-size:15px">' +
            '<input type="checkbox" id="guide-agree"' + (ready ? ' checked' : '') + '><span class="box"></span>' +
            '<span>我已了解以上要求，并确认当前环境符合检测条件。</span>' +
          '</label>' +

          '<div class="callout callout--warn" style="margin-top:20px">本工具仅用于色觉筛查参考，<strong>不能替代专业医学诊断</strong>。如结果提示异常，请到正规医院眼科就诊。</div>' +

          '<div class="row" style="margin-top:28px;gap:12px">' +
            '<button class="btn btn--ghost" data-go="home">返回首页</button>' +
            '<button class="btn btn--primary btn--lg" id="guide-start"' + (ready ? '' : ' disabled') + ' data-go="select">开始检测</button>' +
          '</div>' +
        '</div>'
      );
    },
    mount: function (root) {
      var cb = root.querySelector('#guide-agree');
      var btn = root.querySelector('#guide-start');
      cb.addEventListener('change', function () {
        CC.state.guideReady = cb.checked;
        btn.disabled = !cb.checked;
      });
    }
  };

  /* ---------- 模式选择 ---------- */
  CC.screens.select = {
    title: '模式选择',
    render: function () {
      var modes = [
        { key: 'quick', name: '快速版', qs: '10 题', time: '约 1 分钟', tag: '',
          desc: ['从标准题库中抽取 10 版', '适合首次自查或快速复查', '给出总体结论与置信度'] },
        { key: 'standard', name: '标准版', qs: '24 题', time: '约 3 分钟', tag: '推荐',
          desc: ['完整 24 版石原氏检测图', '区分红色觉 / 绿色觉异常', '给出类型、程度与逐题明细'] },
        { key: 'advanced', name: '进阶版', qs: '24+3', time: '约 4 分钟', tag: '',
          desc: ['标准版全部内容', '追加路径追踪 3 题（描线重合度）', '色相排列（D15）为规划中模块'] }
      ];
      return CC.view.page('select',
        '<div class="guide-wrap">' +
          '<p class="eyebrow">Step 2 / 3</p>' +
          '<h1 style="margin-top:8px">选择检测精度</h1>' +
          '<p class="soft" style="margin-top:12px">题量越大，判读越稳。第一次测建议直接用标准版。</p>' +
          '<div class="mode-grid" style="margin-top:36px">' +
            modes.map(function (m) {
              return '<div class="card card--pad card--hover mode-card ' + (CC.state.mode === m.key ? 'is-sel' : '') + '" data-pick-mode="' + m.key + '">' +
                (m.tag ? '<span class="chip chip--brand tag">' + m.tag + '</span>' : '') +
                '<p class="eyebrow">' + m.name + '</p>' +
                '<h3>' + m.qs + '</h3>' +
                '<div class="meta"><span>' + m.time + '</span><span>' + (m.key === 'advanced' ? '含路径追踪' : '石原氏') + '</span></div>' +
                '<ul>' + m.desc.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' +
                '</div>';
            }).join('') +
          '</div>' +
          '<div class="row" style="margin-top:32px;gap:12px">' +
            '<button class="btn btn--ghost" data-go="guide">上一步</button>' +
            '<button class="btn btn--primary btn--lg" id="mode-go">开始检测</button>' +
          '</div>' +
        '</div>'
      );
    },
    mount: function (root) {
      root.querySelectorAll('[data-pick-mode]').forEach(function (el) {
        el.addEventListener('click', function () {
          CC.state.mode = el.getAttribute('data-pick-mode');
          CC.screens.select.mount(CC.go(CC.state.route, true));
        });
      });
      root.querySelector('#mode-go').addEventListener('click', function () {
        CC.startTest(CC.state.mode);
        CC.go('ishihara');
      });
    }
  };
})();
