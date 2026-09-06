// lib/path-scoring.ts — 路径追踪判读（v1.1）
// chromacheck v1.7.1
import type {
  DeficiencyType,
  Overall,
  PathTrackingQuestion,
  PathTrackingResult,
  Severity,
  TestMode,
  TestResult,
} from './types';

/** 重合度通过阈值（%）与归一化容差 */
const PASS = 70;
const TOL = 0.07;

function resample(path: { x: number; y: number }[], n: number): { x: number; y: number }[] {
  if (path.length < 2) return path.slice();
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) out.push(path[Math.round((i / (n - 1)) * (path.length - 1))]);
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

/** 计算用户轨迹与标准路径的重合度（IoU 思路）0-100 */
function pathOverlap(std: { x: number; y: number }[], user: { x: number; y: number }[]): number {
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
  const overlapScore = pathOverlap(q.standardPath, userPath);
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
    version: '1.0.0',
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
