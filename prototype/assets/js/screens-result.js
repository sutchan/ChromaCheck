/* prototype/assets/js/screens-result.js v0.1.0 — 结果页（维度评分 / 雷达 / 明细 / 建议） */
window.CC = window.CC || {};
CC.screens = CC.screens || {};

(function () {
  'use strict';

  var VERDICT_COLOR = {
    normal: 'var(--ok)', suspected_deficiency: 'var(--warn)',
    suspected_blindness: 'var(--risk)', inconclusive: 'var(--fg-mute)'
  };
  var VERDICT_DESC = {
    normal: '你在这轮检测中没有出现稳定的色觉异常模式。',
    suspected_deficiency: '你的答题出现了可识别的异常模式，属于色弱范畴——能分辨颜色，但需要更大的色差。',
    suspected_blindness: '多版检测图均无法读出，属于色盲范畴。建议尽快到医院眼科做进一步检查。',
    inconclusive: '这次答题矛盾较多，我们不会给出结论。换个时间、屏幕亮度调高后重测一次。'
  };

  /** 计算雷达图六个轴 */
  function axes(res, answers) {
    var byId = {};
    CC.questions.forEach(function (q) { byId[q.id] = q; });
    var tt = 0, tw = 0, vt = 0, vw = 0;
    (answers || []).forEach(function (a) {
      var q = byId[a.questionId];
      if (!q) return;
      if (q.type === 'transformation' || q.type === 'classification') { tt++; if (!a.correct) tw++; }
      if (q.type === 'vanishing') { vt++; if (!a.correct) vw++; }
    });
    var d = res.ishihara.dimensions;
    return {
      values: [
        d.protan, d.deutan, d.tritan,
        tt ? Math.round((tw / tt) * 100) : 0,
        vt ? Math.round((vw / vt) * 100) : 0,
        res.ishihara.dimensions.deutan
      ],
      labels: ['红轴', '绿轴', '蓝轴', '转换题', '消失题', '综合']
    };
  }

  function dimRow(name, value, color) {
    var T = CC.rules.dimension;
    return '<div class="dim-row"><span class="nm">' + name + '</span>' +
      '<span class="track"><span class="fill" style="background:' + color + '" data-w="' + value + '"></span>' +
      '<span class="thr" style="left:30%"></span><span class="thr" style="left:60%"></span></span>' +
      '<span class="sc">' + value + '</span></div>' +
      '<p class="hint" style="margin:-10px 0 0 108px">' + (value < T.normal ? '正常范围' : value < T.mild ? '轻度偏离' : '明显偏离') + '</p>';
  }

  CC.screens.result = {
    title: '结果页',
    render: function () {
      var st = CC.state;
      var res = st.result || CC.demoResult;
      var ish = res.ishihara;
      var answers = st.lastAnswers || CC.demoAnswers;
      var ax = axes(res, answers);
      var dur = Math.round((new Date(res.endTime) - new Date(res.startTime)) / 1000);
      var color = VERDICT_COLOR[ish.overall];

      return CC.view.page('result',
        '<div class="result-wrap">' +

          '<div class="verdict rise" style="--verdict-color:' + color + '">' +
            '<div>' +
              '<p class="eyebrow">检测结论 · ' + CC.modeText[res.mode] + '</p>' +
              '<h1 style="margin-top:10px;color:' + color + '">' + CC.overallLabel[ish.overall] +
                (ish.type ? ' · ' + CC.typeText[ish.type] : '') + '</h1>' +
              '<p class="sub">' + VERDICT_DESC[ish.overall] + '</p>' +
              '<div class="chips">' +
                (ish.severity ? '<span class="chip chip--warn">程度 ' + CC.severityText[ish.severity] + '</span>' : '') +
                '<span class="chip chip--outline">正确 ' + ish.details.correctCount + '/' + ish.details.totalCount + '</span>' +
                '<span class="chip chip--outline">用时 ' + Math.floor(dur / 60) + ' 分 ' + (dur % 60) + ' 秒</span>' +
                '<span class="chip chip--outline">' + (res.device || '本机浏览器') + '</span>' +
              '</div>' +
              '<div class="row" style="gap:10px;margin-top:28px">' +
                '<a class="btn btn--primary" href="report.html" target="_blank">导出 PNG / PDF 报告</a>' +
                '<button class="btn btn--secondary" data-go="guide">重新检测</button>' +
              '</div>' +
            '</div>' +
            '<div class="gauge">' + CC.gauge(ish.confidence, color) +
              '<div style="text-align:center"><div class="val" id="conf-val">0</div><div class="lab">置信度</div></div>' +
            '</div>' +
          '</div>' +

          (ish.confidence < 60
            ? '<div class="callout callout--warn">置信度低于 60，结论仅供参考：本次答题存在过快、演示题答错或答案相互矛盾的情况。</div>'
            : '') +

          '<div class="grid grid-3">' +
            '<div class="card card--pad">' +
              '<div class="row row--between" style="margin-bottom:20px"><strong>三维异常评分</strong><span class="chip chip--outline">0–100</span></div>' +
              '<div class="dim-list">' +
                dimRow('红色觉', ish.dimensions.protan, 'var(--axis-protan)') +
                dimRow('绿色觉', ish.dimensions.deutan, 'var(--axis-deutan)') +
                dimRow('蓝色觉', ish.dimensions.tritan, 'var(--axis-tritan)') +
              '</div>' +
              '<p class="hint" style="margin-top:16px">竖线为 30 / 60 阈值：低于 30 正常，30–60 轻度，高于 60 明显。</p>' +
            '</div>' +

            '<div class="card card--pad">' +
              '<div class="row row--between" style="margin-bottom:8px"><strong>色觉画像</strong><span class="chip chip--outline">六维</span></div>' +
              '<div class="radar-box">' + CC.radar(ax.values, ax.labels) + '</div>' +
            '</div>' +

            '<div class="card card--pad">' +
              '<strong>错误模式</strong>' +
              '<div class="stack" style="margin-top:16px">' +
                ish.details.errorPatterns.map(function (p) {
                  var cls = p.type === 'deutan' ? 'chip--warn' : p.type === 'protan' ? 'chip--risk' : 'chip--outline';
                  return '<div><span class="chip ' + cls + '">' + (p.type === 'deutan' ? '绿轴' : p.type === 'protan' ? '红轴' : '混合') + '</span>' +
                    '<p class="muted" style="font-size:13px;margin-top:8px">' + p.description + '</p></div>';
                }).join('') +
              '</div>' +
              (res.pathTracking
                ? '<hr class="dot-rule" style="margin:20px 0"><strong>进阶测试</strong>' +
                  res.pathTracking.map(function (p, i) {
                    return '<div class="row row--between" style="margin-top:12px"><span class="muted" style="font-size:13px">路径 ' + (i + 1) + '</span>' +
                      '<span class="mono">' + p.overlapScore + '% ' + (p.passed ? '✅' : '⚠️') + '</span></div>';
                  }).join('') +
                  '<div class="row row--between" style="margin-top:12px"><span class="muted" style="font-size:13px">色相排列 TES</span>' +
                  '<span class="mono">' + res.hueArrangement.totalErrorScore + ' · ' + (res.hueArrangement.normal ? '正常' : '偏差') + '</span></div>'
                : '<hr class="dot-rule" style="margin:20px 0"><p class="muted" style="font-size:13px">本次为' + CC.modeText[res.mode] + '，未包含进阶测试。做进阶版可得到路径追踪与色相排列结果。</p>') +
            '</div>' +
          '</div>' +

          '<div class="card">' +
            '<div class="card-head"><strong>逐题明细</strong><span class="muted" style="font-size:13px">共 ' + answers.length + ' 版 · 灰底为未读出数字</span></div>' +
            '<div class="card-body"><div class="answer-grid">' +
              answers.map(function (a) {
                var q = CC.questions.filter(function (x) { return x.id === a.questionId; })[0] || {};
                return '<div class="ans-cell ' + (a.correct ? 'is-right' : 'is-wrong') + '">' +
                  '<div class="pn">No.' + String(q.plate || '?').padStart(2, '0') + '</div>' +
                  '<div class="an">' + (a.userAnswer === '' ? '——' : a.userAnswer) + '</div>' +
                  '<div class="tm">' + (a.durationMs / 1000).toFixed(1) + 's</div>' +
                  '</div>';
              }).join('') +
            '</div></div>' +
          '</div>' +

          '<div>' +
            '<h2 style="font-size:var(--fs-h2);margin-bottom:20px">接下来可以做什么</h2>' +
            '<div class="advice">' +
              '<div class="a"><h4>🔎 生活上</h4><ul>' +
                '<li>买衣服时用吊牌标签区分颜色，别靠肉眼。</li>' +
                '<li>手机与电脑开启系统自带的色彩滤镜（红绿滤镜）。</li>' +
                '<li>看图表时依靠图例与文字标注，不依赖配色。</li>' +
                '<li>判断肉类熟度、水果成熟度改用时间或触感。</li>' +
              '</ul></div>' +
              '<div class="a"><h4>🏥 就医与职业</h4><ul>' +
                '<li>结果异常请到正规医院眼科做 anomaloscope 检查。</li>' +
                '<li>高考体检、驾照申领以医院出具的结论为准。</li>' +
                '<li>美术、化工、飞行、航海等专业对色觉有明确要求。</li>' +
                '<li>本报告的 PDF 可作为初筛记录带去门诊。</li>' +
              '</ul></div>' +
            '</div>' +
          '</div>' +

          '<div class="callout callout--warn"><span>⚠</span><span>本工具仅用于色觉筛查参考，<strong>不能替代专业医学诊断</strong>。结果受屏幕色域、亮度与环境光影响。如结果提示异常，请前往正规医院眼科就诊。</span></div>' +
        '</div>'
      );
    },

    mount: function (root) {
      var res = CC.state.result || CC.demoResult;
      var el = root.querySelector('#conf-val');
      if (el) CC.countUp(el, res.ishihara.confidence, '');
      setTimeout(function () {
        root.querySelectorAll('.dim-row .fill').forEach(function (f) {
          f.style.width = f.getAttribute('data-w') + '%';
        });
      }, 120);
    }
  };
})();
