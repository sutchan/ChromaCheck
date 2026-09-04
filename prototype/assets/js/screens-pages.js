/* prototype/assets/js/screens-pages.js v0.1.2 — 历史记录 / 科普列表 / 科普详情 */
window.CC = window.CC || {};
CC.screens = CC.screens || {};

(function () {
  'use strict';
  var esc = CC.view.esc;

  function fmtDate(iso) {
    var d = new Date(iso);
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  CC.fmtDate = fmtDate;

  function verdictChip(h) {
    var map = {
      normal: 'chip--ok', suspected_deficiency: 'chip--warn',
      suspected_blindness: 'chip--risk', inconclusive: 'chip--outline'
    };
    return '<span class="chip ' + map[h.overall] + '"><span class="dot-status"></span>' + CC.overallLabel[h.overall] + '</span>';
  }

  /* ---------- 历史记录 ---------- */
  CC.screens.history = {
    title: '历史记录',
    render: function () {
      var list = CC.state.history;
      var asc = list.slice().reverse();
      var labels = asc.map(function (h) { return fmtDate(h.date).slice(0, 10); });
      var series = asc.map(function (h) { return h.dims[1]; });
      return CC.view.page('history',
        '<section class="section" style="max-width:1160px;margin:0 auto;width:100%">' +
          '<div class="row row--between" style="margin-bottom:24px">' +
            '<div><h1 style="font-size:var(--fs-h1)">检测历史</h1><p class="muted" style="margin-top:6px">共 ' + list.length + ' 条记录，存于本机浏览器，最多保留 20 条。</p></div>' +
            '<button class="btn btn--secondary" data-act="clear-history">清空全部</button>' +
          '</div>' +

          '<div class="card card--pad" style="margin-bottom:24px">' +
            '<div class="row row--between" style="margin-bottom:12px">' +
              '<div><p class="eyebrow">绿色觉维度评分趋势</p><p class="muted" style="font-size:13px">越接近 100 表示该维度偏离正常越远</p></div>' +
              '<span class="chip chip--outline">近 6 次</span>' +
            '</div>' +
            CC.trend(series, labels) +
          '</div>' +

          '<div class="card">' +
            '<div class="card-head"><strong>全部记录</strong><span class="muted" style="font-size:13px">点击任意一行查看完整结果</span></div>' +
            list.map(function (h) {
              return '<div class="hist-row" data-open-result="' + h.id + '">' +
                '<span class="date">' + fmtDate(h.date).slice(0, 16) + '</span>' +
                '<span>' + verdictChip(h) + (h.type ? ' <span class="muted" style="font-size:12px">' + CC.typeText[h.type] + ' · ' + CC.severityText[h.severity] + '</span>' : '') + '</span>' +
                '<span class="muted" style="font-size:13px">' + CC.modeText[h.mode] + '</span>' +
                '<span class="row">' + CC.spark(h.dims, 100) + '<span class="mono" style="font-size:12px;margin-left:10px">' + h.confidence + '%</span></span>' +
                '<button class="btn btn--ghost btn--sm" data-act="del-history" data-id="' + h.id + '">删除</button>' +
                '</div>';
            }).join('') +
          '</div>' +

          '<div class="callout" style="margin-top:24px">历史记录只保存结论摘要，不保存你的逐题答案。清除浏览器数据会一并删除，且无法恢复。</div>' +
        '</section>'
      );
    },
    mount: function (root) {
      root.querySelectorAll('[data-open-result]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          if (e.target.closest('[data-act]')) return;
          CC.state.resultId = el.getAttribute('data-open-result');
          CC.go('result');
        });
      });
      root.querySelectorAll('[data-act="del-history"]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = el.getAttribute('data-id');
          CC.state.history = CC.state.history.filter(function (h) { return h.id !== id; });
          CC.toast('已删除记录 ' + id);
          CC.rerender();
        });
      });
      root.querySelector('[data-act="clear-history"]').addEventListener('click', function () {
        CC.state.history = [];
        CC.toast('已清空全部历史记录');
        CC.rerender();
      });
    }
  };

  /* ---------- 科普列表 ---------- */
  CC.screens.learn = {
    title: '色觉科普',
    render: function () {
      var cats = ['全部'].concat(CC.articles.map(function (a) { return a.cat; }).filter(function (v, i, s) { return s.indexOf(v) === i; }));
      var cur = CC.state.cat || '全部';
      var list = CC.articles.filter(function (a) { return cur === '全部' || a.cat === cur; });
      return CC.view.page('learn',
        '<section class="section" style="max-width:1160px;margin:0 auto;width:100%">' +
          '<div class="section-head"><p class="eyebrow">Learn</p><h1 style="margin-top:10px">把色觉这件事讲清楚</h1><p>从原理到职业限制，六篇文章覆盖你真正会问的问题。</p></div>' +
          '<div class="row" style="gap:8px;margin-bottom:28px;flex-wrap:wrap">' +
            cats.map(function (c) {
              return '<button class="chip ' + (c === cur ? 'chip--brand' : 'chip--outline') + '" data-cat="' + c + '" style="height:30px">' + c + '</button>';
            }).join('') +
          '</div>' +
          '<div class="grid grid-3">' +
            list.map(function (a) {
              var i = CC.articles.indexOf(a);
              return '<article class="card card--hover" data-go="learnDetail" data-idx="' + i + '" style="cursor:pointer">' +
                '<div style="height:132px;background:linear-gradient(135deg,' + a.hue + ',color-mix(in srgb,' + a.hue + ' 55%, #0e141b))"></div>' +
                '<div style="padding:20px">' +
                  '<span class="chip chip--outline">' + a.cat + '</span>' +
                  '<h3 style="margin-top:12px;font-size:var(--fs-h4)">' + esc(a.title) + '</h3>' +
                  '<p class="muted" style="margin-top:8px;font-size:13px">' + esc(a.excerpt) + '</p>' +
                  '<p class="muted" style="margin-top:14px;font-size:12px">阅读约 ' + a.read + '</p>' +
                '</div></article>';
            }).join('') +
          '</div>' +
        '</section>'
      );
    },
    mount: function (root) {
      root.querySelectorAll('[data-cat]').forEach(function (el) {
        el.addEventListener('click', function () {
          CC.state.cat = el.getAttribute('data-cat');
          CC.rerender();
        });
      });
    }
  };

  /* ---------- 科普详情 ---------- */
  CC.screens.learnDetail = {
    title: '科普详情',
    render: function () {
      var a = CC.articles[CC.state.articleIdx || 0];
      var body = a.body || [
        ['色觉是怎么来的', '视网膜上有三类视锥细胞，分别对长波（红）、中波（绿）、短波（蓝）最敏感。大脑比较三类细胞的信号强弱，才"算"出颜色。任何一类细胞缺失或功能减弱，比较的基准就变了，某些颜色就会彼此混淆。'],
        ['为什么红绿最难分', '红色与绿色的敏感曲线在光谱上高度重叠，两者只靠信号强弱比值区分。一旦中波或长波细胞出问题，这个比值就会失真——这就是红绿色觉异常占全部色觉异常 99% 的原因。'],
        ['检测图为什么用点阵', '石原氏图的关键不是"画了个数字"，而是所有色点明度一致、只差色相。这样既不能靠亮度猜，也不能靠轮廓猜，只有真正能分辨该色相差异的人才读得出来。'],
        ['在线检测和医院检查差在哪', '医院用的是标准光源箱 + 纸质图谱，还配有假同色图、色相排列和 anomaloscope（色觉镜）等仪器。在线检测受屏幕色域与环境光限制，只能作为初筛。']
      ];
      return CC.view.page('learn',
        '<article style="max-width:720px;margin:0 auto;padding:56px 24px 96px">' +
          '<button class="btn btn--ghost btn--sm" data-go="learn">← 返回列表</button>' +
          '<span class="chip chip--outline" style="margin-top:28px">' + a.cat + ' · 阅读约 ' + a.read + '</span>' +
          '<h1 style="font-size:var(--fs-h1);margin-top:16px">' + esc(a.title) + '</h1>' +
          '<p class="soft" style="margin-top:14px;font-size:17px">' + esc(a.excerpt) + '</p>' +
          '<hr class="dot-rule">' +
          body.map(function (b) {
            return '<h2 style="font-size:var(--fs-h3);margin-top:36px">' + b[0] + '</h2><p style="margin-top:12px;color:var(--fg-soft)">' + b[1] + '</p>';
          }).join('') +
          '<div class="callout callout--info" style="margin-top:40px">内容经眼科顾问审校。如对自己的色觉有疑虑，请以医院检查结果为准。</div>' +
          '<div class="row row--between" style="margin-top:40px">' +
            '<button class="btn btn--ghost" data-go="learn">← 返回列表</button>' +
            '<button class="btn btn--primary" data-go="guide">去做一次检测</button>' +
          '</div>' +
        '</article>'
      );
    }
  };
})();
