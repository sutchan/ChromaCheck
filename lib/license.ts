// lib/license.ts — 结果映射至驾照辨色力要求（172 号令第十二条）
// chromacheck v1.9.0
import type { DeficiencyType, Overall, Severity, TestResult } from './types';
import { t, type Lang } from './i18n';

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
  /** 与本次结果对应的异常类型（用于澄清色弱≠色盲） */
  note: string;
}

const REG_KEY = 'license.regText';

/**
 * 将检测结果映射到驾照辨色力要求。
 * 法规仅禁止「红绿色盲」，未禁止「色弱」；体检尺度各地不一，故结论仅供参考。
 */
export function mapToLicense(result: TestResult, lang: Lang = 'zh'): LicenseRef {
  const { overall, type, severity } = result;
  const sevText = severity ? t(lang, severity === 'mild' ? 'license.sevMild' : severity === 'moderate' ? 'license.sevModerate' : 'license.sevSevere') : '';
  const reg = t(lang, REG_KEY);

  if (overall === 'normal') {
    return {
      verdict: 'compliant',
      title: t(lang, 'license.compliantTitle'),
      detail: t(lang, 'license.compliantDetail'),
      touchesProhibition: false,
      note: t(lang, 'license.compliantNote'),
    };
  }

  if (overall === 'inconclusive') {
    return {
      verdict: 'uncertain',
      title: t(lang, 'license.uncertainTitle'),
      detail: `${t(lang, 'license.uncertainDetail')}${reg}`,
      touchesProhibition: false,
      note: t(lang, 'license.uncertainNote'),
    };
  }

  // suspected_deficiency（色弱）或 suspected_blindness（色盲）
  const isBlindness = overall === 'suspected_blindness';
  const typeText = type
    ? type.includes('protan')
      ? t(lang, 'license.typeProtan')
      : type.includes('deutan')
        ? t(lang, 'license.typeDeutan')
        : type.includes('tritan')
          ? t(lang, 'license.typeTritan')
          : t(lang, 'license.typeGeneric')
    : t(lang, 'license.typeGeneric');
  const anomalyOrBlind = type && type.endsWith('omaly') ? t(lang, 'license.anomalyWeak') : type && type.endsWith('opia') ? t(lang, 'license.anomalyBlind') : t(lang, 'license.anomalyGeneric');

  if (isBlindness && type && (type === 'protanopia' || type === 'deuteranopia')) {
    return {
      verdict: 'non_compliant',
      title: t(lang, 'license.nonCompliantTitle'),
      detail: t(lang, 'license.nonCompliantDetail', { type: typeText, sev: sevText ? `（${sevText}）` : '' }),
      touchesProhibition: true,
      note: t(lang, 'license.nonCompliantNote'),
    };
  }

  // 色弱（或蓝黄色觉异常、未明确分型的红绿色弱）
  return {
    verdict: 'deficiency_only',
    title: t(lang, 'license.deficiencyTitle'),
    detail: t(lang, 'license.deficiencyDetail', { type: typeText, sev: sevText ? `（${sevText}）` : '', anomaly: anomalyOrBlind }),
    touchesProhibition: false,
    note: t(lang, 'license.deficiencyNote'),
  };
}
