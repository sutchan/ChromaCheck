/* prototype/assets/js/scoring.js v0.1.0 — 判读引擎（纯函数，对应 lib/scoring/*） */
window.CC = window.CC || {};

(function () {
  'use strict';

  /** 计算每题是否正确：空答案按题型判定（hidden 题空答案为正确） */
  function isCorrect(q, userAnswer) {
    var ua = (userAnswer || '').trim();
    if (q.type === 'hidden') return ua === '';
    if (ua === '') return false;
    return ua === q.answer;
  }

  /** 该答案是否符合某类异常的典型表现 */
  function matches(q, ua, axis) {
    var alt = axis === 'protan' ? q.protan : q.deutan;
    if (!alt) return false;
    return (ua || '').trim() === alt;
  }

  /**
   * 石原氏判读：输入答题记录，输出 IshiharaScoringResult
   * @param {Array} answers [{questionId, userAnswer, durationMs}]
   * @param {Array} questions 题库子集
   */
  function scoreIshihara(answers, questions) {
    var map = {};
    answers.forEach(function (a) { map[a.questionId] = a; });

    var total = questions.length;
    var correct = 0, vanishWrong = 0, vanishTotal = 0, hiddenRight = 0, hiddenTotal = 0;
    var protanHit = 0, deutanHit = 0, fastCount = 0, demoWrong = 0, answered = 0;

    questions.forEach(function (q) {
      var rec = map[q.id];
      if (!rec) return;
      answered++;
      var ua = rec.userAnswer || '';
      var ok = isCorrect(q, ua);
      if (ok) correct++;

      if (rec.durationMs > 0 && rec.durationMs < 1000) fastCount++;
      if (q.type === 'demonstration' && !ok) demoWrong++;
      if (q.type === 'vanishing') {
        vanishTotal++;
        if (!ok) vanishWrong++;
      }
      if (q.type === 'hidden') {
        hiddenTotal++;
        if (ua.trim() !== '') hiddenRight++;
      }
      if (q.type === 'transformation' || q.type === 'classification') {
        if (matches(q, ua, 'protan')) protanHit++;
        if (matches(q, ua, 'deutan')) deutanHit++;
      }
    });

    // 维度评分：错误占比 × 轴匹配权重
    var wrong = Math.max(total - correct, 0);
    var base = Math.round(Math.min(100, (wrong / Math.max(total, 1)) * 130));
    var dimensions = {
      protan: clamp(base + protanHit * 8 - deutanHit * 3, 0, 100),
      deutan: clamp(base + deutanHit * 8 - protanHit * 3, 0, 100),
      tritan: clamp(Math.round(base * 0.35), 0, 100)
    };

    // 总体结论
    var overall = 'normal';
    if (answered < total * 0.5) overall = 'inconclusive';
    else if (vanishWrong >= 4 || wrong >= 8) overall = 'suspected_blindness';
    else if (vanishWrong >= 2 || wrong >= 4 || hiddenRight >= Math.ceil(hiddenTotal / 2)) overall = 'suspected_deficiency';
    if (demoWrong > 0 && protanHit === 0 && deutanHit === 0 && wrong < 4) overall = 'inconclusive';

    // 类型与程度
    var type = null, severity = null;
    if (overall === 'suspected_deficiency' || overall === 'suspected_blindness') {
      if (deutanHit >= protanHit) type = overall === 'suspected_blindness' ? 'deuteranopia' : 'deuteranomaly';
      else type = overall === 'suspected_blindness' ? 'protanopia' : 'protanomaly';
      var rate = wrong / Math.max(total, 1);
      severity = rate >= 0.7 ? 'severe' : rate >= 0.4 ? 'moderate' : 'mild';
    }

    // 置信度
    var R = CC.rules.confidence;
    var confidence = R.base + demoWrong * R.demoWrong + fastCount * R.tooFast;
    if (protanHit > 0 && deutanHit > 0) confidence += R.contradiction;
    if (answered < total * 0.5) confidence += R.lowCoverage;
    confidence = clamp(confidence, R.min, 100);

    var patterns = [];
    if (deutanHit) patterns.push({ type: 'deutan', questionCount: deutanHit, description: '转换/分类题中 ' + deutanHit + ' 题答案符合绿色觉异常典型表现' });
    if (protanHit) patterns.push({ type: 'protan', questionCount: protanHit, description: '转换/分类题中 ' + protanHit + ' 题答案符合红色觉异常典型表现' });
    if (vanishWrong) patterns.push({ type: 'mixed', questionCount: vanishWrong, description: '消失题中有 ' + vanishWrong + ' 题未能读出数字' });
    if (!patterns.length) patterns.push({ type: 'random', questionCount: 0, description: '未发现稳定的错误模式' });

    return {
      overall: overall, type: type, severity: severity, confidence: confidence,
      dimensions: dimensions,
      details: { correctCount: correct, totalCount: total, errorPatterns: patterns }
    };
  }

  /** 色相排列 TES：相邻位置偏差求和 */
  function scoreHue(order) {
    var errs = [], tes = 0;
    for (var i = 0; i < order.length - 1; i++) {
      var d = Math.abs(order[i] - order[i + 1]);
      var e = i === 0 || i === order.length - 2 ? Math.max(0, d - 1) : Math.max(0, d - 1) * 2;
      errs.push(e); tes += e;
    }
    var T = CC.rules.tes;
    return {
      totalErrorScore: tes, cardErrors: errs,
      deviationDirection: tes < T.normal ? 'none' : 'deutan',
      normal: tes < T.normal
    };
  }

  /** 路径重合度：用户轨迹点落在标准路径容差内的比例 */
  function scorePath(userPath, standardPath, tolerance) {
    if (!userPath.length) return 0;
    var tol = tolerance || 0.055, hit = 0;
    standardPath.forEach(function (p) {
      var best = Infinity;
      userPath.forEach(function (u) {
        var d = Math.hypot(u.x - p.x, u.y - p.y);
        if (d < best) best = d;
      });
      if (best <= tol) hit++;
    });
    return Math.round((hit / standardPath.length) * 100);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  CC.scoreIshihara = scoreIshihara;
  CC.scoreHue = scoreHue;
  CC.scorePath = scorePath;
  CC.isCorrect = isCorrect;
})();
