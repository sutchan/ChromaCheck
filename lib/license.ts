// lib/license.ts — 结果映射至驾照辨色力要求（172 号令第十二条）
// chromacheck v1.7.0
import type { DeficiencyType, Overall, Severity, TestResult } from './types';

export type LicenseVerdict = 'compliant' | 'non_compliant' | 'uncertain' | 'deficiency_only';

export interface LicenseRef {
  /** 结论级别 */
  verdict: LicenseVerdict;
  /** 标题 */
  title: string;
  /** 对照法规的说明 */
  detail: string;
  /** 是否触及「无红绿色盲」禁止条款 */
  touchesProhibition: boolean;
  /** 与本次结果对应的异常类型中文（用于澄清色弱≠色盲） */
  note: string;
}

const REG = '《机动车驾驶证申领和使用规定》（公安部令第 172 号，2024-12 修订）第十二条：辨色力——无红绿色盲。';

/**
 * 将检测结果映射到驾照辨色力要求。
 * 法规仅禁止「红绿色盲」，未禁止「色弱」；体检尺度各地不一，故结论仅供参考。
 */
export function mapToLicense(result: TestResult): LicenseRef {
  const { overall, type, severity } = result;
  const sevText = severity ? (severity === 'mild' ? '轻度' : severity === 'moderate' ? '中度' : '重度') : '';

  if (overall === 'normal') {
    return {
      verdict: 'compliant',
      title: '符合基本要求',
      detail: `本次筛查未见明显红绿色觉异常，符合「${REG.slice(REG.indexOf('无红绿色盲'))}」的基本要求倾向。最终仍须以指定体检机构的结论为准。`,
      touchesProhibition: false,
      note: '本次筛查未见明显红绿色觉异常。',
    };
  }

  if (overall === 'inconclusive') {
    return {
      verdict: 'uncertain',
      title: '结果不确定',
      detail: `本次作答样本不足或有明显误读，无法判断是否触及驾照辨色力要求。建议调整环境光线后重新检测。${REG}`,
      touchesProhibition: false,
      note: '结果不确定，无法判断是否触及禁止条款。',
    };
  }

  // suspected_deficiency（色弱）或 suspected_blindness（色盲）
  const isBlindness = overall === 'suspected_blindness';
  const typeText = type
    ? type.includes('protan')
      ? '红色觉'
      : type.includes('deutan')
        ? '绿色觉'
        : '蓝色觉'
    : '色觉';
  const anomalyOrBlind = type && type.endsWith('omaly') ? '色弱（异常三色视觉）' : type && type.endsWith('opia') ? '色盲（二色视觉）' : '色觉异常';

  if (isBlindness && type && (type === 'protanopia' || type === 'deuteranopia')) {
    return {
      verdict: 'non_compliant',
      title: '疑似触及禁止条款',
      detail: `本次结果提示${typeText}${sevText ? `（${sevText}）` : ''}色盲，触及${REG}的「无红绿色盲」要求。请注意：筛查不等于诊断，建议前往正规医院眼科以 anomaloscope 等仪器进一步确认。`,
      touchesProhibition: true,
      note: `你本次属于「色盲」而非「色弱」。法规仅禁止红绿色盲，色盲与色弱性质不同。`,
    };
  }

  // 色弱（或蓝黄色觉异常、未明确分型的红绿色弱）
  return {
    verdict: 'deficiency_only',
    title: '疑似色弱（一般不在禁驾之列）',
    detail: `本次结果提示${typeText}${sevText ? `（${sevText}）` : ''}${anomalyOrBlind}。${REG}仅禁止「红绿色盲」，色弱通常不在禁驾范围之内；但各地体检尺度不一，最终以指定体检机构结论为准。`,
    touchesProhibition: false,
    note: '你本次属于「色弱」而非「色盲」。法规只禁止色盲，色弱与色盲不同，是否影响驾照以体检为准。',
  };
}
