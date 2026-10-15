// lib/path-scoring.ts — 路径追踪判读（v1.1）
// chromacheck v1.8.2
import type {
  DeficiencyType,
  Overall,
  PathTrackingQuestion,
  PathTrackingResult,
  Severity,
  TestMode,
  TestResult,
} from './types';

/** 重合度通过阈值（%）；TOL 为归一化坐标容差（0.07 = 画布 7%） */
const PASS = 70;
const TOL = 0.07;

/** 按累计弧长等距重采样，避免按索引取样在采样不均时偏差过大 */
function resample(path: { x: number; y: number }[], n: number): { x: number; y: number }[] {
  if (path.length < 2) return path.slice();
  const cum: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y));
  }
  const total = cum[cum.length - 1];
  if (total === 0) return Array.from({ length: n }, () => ({ ...path[0] }));
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const d = (i / (n - 1)) * total;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= d) lo = mid;
      else hi = mid;
    }
    const segLen = cum[hi] - cum[lo] || 1;
    const t = (d - cum[lo]) / segLen;
    out.push({
      x: path[lo].x + (path[hi].x - path[lo].x) * t,
      y: path[lo].y + (path[hi].y - path[lo].y) * t,
    });
  }
  return out;
}

function minDist(p: { x: number; y: number }, pts: { x: number; y: number }[]): number {
  let m = Infinity;
  for (const q of pts) {
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < m) m = d;
  }
  return m;
}

/**
 * 计算用户轨迹与标准路径的重合度（F1 思路，非 IoU）：
 * coverage = 标准点中被用户轨迹覆盖的比例，precision = 用户点中落在标准附近的比例，
 * F1 = 2·cov·prec / (cov+prec)。坐标均为归一化 0–1，TOL=0.07 即画布 7%。
 */
function pathF1(std: { x: number; y: number }[], user: { x: number; y: number }[]): number {
  if (user.length < 2) return 0;
  const S = resample(std, 80);
  const U = resample(user, 80);
  let cov = 0;
  for (const p of S) if (minDist(p, U) <= TOL) cov++;
  cov /= S.length;
  let prec = 0;
  for (const p of U) if (minDist(p, S) <= TOL) prec++;
  prec /= U.length;
  if (cov + prec - cov * prec <= 0) return 0;
  return Math.round(((cov * prec) / (cov + prec - cov * prec)) * 100);
}

export function scorePathTracking(q: PathTrackingQuestion, userPath: { x: number; y: number }[]): PathTrackingResult {
  const overlapScore = pathF1(q.standardPath, userPath);
  return { questionId: q.id, overlapScore, userPath, passed: overlapScore >= PASS };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function mean(a: number[]): number {
  return a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
}

/** 由多题路径追踪结果汇总为完整 TestResult（ishihara 字段留空） */
export function computePathResult(
  results: PathTrackingResult[],
  questions: PathTrackingQuestion[],
  opts: { testMode: TestMode; startedAt: number; endedAt: number; device: string },
): TestResult {
  const avg = Math.round(mean(results.map((r) => r.overlapScore)));
  const overall: Overall = avg >= 70 ? 'normal' : avg >= 30 ? 'suspected_deficiency' : 'suspected_blindness';

  let protanFail = 0;
  let deutanFail = 0;
  results.forEach((r, i) => {
    if (!r.passed) {
      const t = questions[i]?.targets ?? [];
      if (t.includes('protan')) protanFail++;
      if (t.includes('deutan')) deutanFail++;
    }
  });

  let type: DeficiencyType = null;
  let severity: Severity = null;
  if (overall !== 'normal') {
    const blind = overall === 'suspected_blindness';
    if (protanFail >= deutanFail) type = blind ? 'protanopia' : 'protanomaly';
    else type = blind ? 'deuteranopia' : 'deuteranomaly';
    severity = blind ? 'moderate' : 'mild';
  }

  // confidence 为内部质量估计（基于平均重合度），非统计置信度；UI 标注为“判读稳定性（内部估计）”。
  const confidence = clamp(Math.round(avg + (results.length > 1 ? 8 : 0)), 0, 100);
  const passedCount = results.filter((r) => r.passed).length;
  const blindLabel = overall === 'suspected_blindness' ? '色盲' : '色弱';
  const tLabel = type ? (type.includes('protan') ? '红色觉' : '绿色觉') : '';
  const analysis =
    overall === 'normal'
      ? '路径追踪中你准确描出了嵌入色点连成的路径，未见明显红/绿色觉异常。在线筛查不能替代专业眼科检查，如仍有疑虑请就医复查。'
      : `路径追踪显示部分路径描线重合度偏低，结果提示${tLabel}${blindLabel}。红/绿色点路径与背景干扰色点的区分可能存在困难，建议在职业选择与日常安全场景中多加留意，必要时前往正规医院眼科复查。`;
  const confidenceNote = `基于 ${passedCount}/${results.length} 条路径追踪，平均重合度 ${avg}%。`;

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cc-${Date.now()}`,
    schema: 'cc.result/v1',
    version: '1.8.2', // 结果结构版本；解析方应对未知字段保持兼容（向后兼容）
    createdAt: new Date(opts.endedAt).toISOString(),
    testMode: opts.testMode,
    overall,
    type,
    severity,
    confidence,
    durationMs: Math.max(0, opts.endedAt - opts.startedAt),
    answers: [],
    ishihara: undefined,
    pathTracking: results,
    analysis,
    confidenceNote,
    device: opts.device,
  };
}
