/* prototype/assets/js/scoring.js v0.1.1 — 判读引擎（纯函数，对齐 lib/scoring.ts：错误率阈值） */
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

    // 总体结论（对齐 app/lib/scoring.ts：改用错误率阈值，兼容任意题量）
    var overall = 'normal';
    var wrongRate = wrong / Math.max(answered, 1);
    if (answered < total * 0.5) overall = 'inconclusive';
    else if (vanishWrong >= 4 || wrongRate >= 0.6) overall = 'suspected_blindness';
    else if (vanishWrong >= 2 || wrongRate >= 0.3 || hiddenRight >= Math.ceil(hiddenTotal / 2)) overall = 'suspected_deficiency';
    if (demoWrong > 0 && protanHit === 0 && deutanHit === 0 && wrongRate < 0.3) overall = 'inconclusive';

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

  /** 色相排列 TES：相邻位置偏差求和（order 已含固定两端 0/14） */
  function scoreHue(seq) {
    var errs = [], tes = 0;
    for (var i = 0; i < seq.length - 1; i++) {
      var d = Math.abs(seq[i] - seq[i + 1]);
      var e = i === 0 || i === seq.length - 2 ? Math.max(0, d - 1) : Math.max(0, d - 1) * 2;
      errs.push(e); tes += e;
    }
    var T = CC.rules.tes;
    var direction = 'none';
    if (tes >= T.normal) {
      var redGreen = 0, blueYellow = 0;
      for (var j = 0; j < seq.length - 1; j++) {
        if (Math.min(seq[j], seq[j + 1]) <= 5) blueYellow += errs[j];
        else redGreen += errs[j];
      }
      direction = redGreen >= blueYellow ? 'deutan' : 'tritan';
    }
    return {
      totalErrorScore: tes, cardErrors: errs,
      deviationDirection: direction,
      normal: tes < T.normal
    };
  }

  /** 路径重合度：用户轨迹与标准路径的 IoU（对齐 lib/path-scoring.ts） */
  function scorePath(userPath, standardPath, tolerance) {
    if (!userPath || userPath.length < 2) return 0;
    var TOL = tolerance || 0.07;
    var S = resample(standardPath, 80);
    var U = resample(userPath, 80);
    function minDist(p, pts) {
      var m = Infinity;
      for (var k = 0; k < pts.length; k++) {
        var d = Math.hypot(p.x - pts[k].x, p.y - pts[k].y);
        if (d < m) m = d;
      }
      return m;
    }
    var cov = 0;
    S.forEach(function (p) { if (minDist(p, U) <= TOL) cov++; });
    cov /= S.length;
    var prec = 0;
    U.forEach(function (p) { if (minDist(p, S) <= TOL) prec++; });
    prec /= U.length;
    if (cov + prec - cov * prec <= 0) return 0;
    return Math.round(((cov * prec) / (cov + prec - cov * prec)) * 100);
  }

  /** 等距重采样到 n 个点（对齐 lib/path-scoring.ts） */
  function resample(path, n) {
    if (path.length < 2) return path.slice();
    var out = [];
    for (var i = 0; i < n; i++) out.push(path[Math.round((i / (n - 1)) * (path.length - 1))]);
    return out;
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  CC.scoreIshihara = scoreIshihara;
  CC.scoreHue = scoreHue;
  CC.scorePath = scorePath;
  CC.isCorrect = isCorrect;
})();
