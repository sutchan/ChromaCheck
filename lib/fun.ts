// lib/fun.ts — 趣味性数据与文案（移植自 prototype data.js §6.5，受「趣味体验」开关控制）
// chromacheck v1.7.1
import type { AxisKey, DeficiencyType, Overall, PlateType } from './types';

/** 边界：答题中永不显示对错；称号为旅人隐喻、去污名化，仅本机展示，可随开关关闭。 */

/* 检测章节（按题型分组）：0 暖身 / 1 主体 / 2 深水 */
export interface Chapter {
  name: string;
  icon: string;
  copy: string;
}

export const CHAPTERS: Chapter[] = [
  { name: '热身 · 读懂规则', icon: '◍', copy: '演示图人人可见，用来确认你理解了玩法——读出数字，读不出就选「看不清」。' },
  { name: '主体 · 分岔的数字', icon: '⌁', copy: '转换题看你把它读成什么，消失题看你是否读得出。第一反应最准，不要盯太久。' },
  { name: '深水 · 类型判定', icon: '◒', copy: '隐藏题反向探测，分类题区分红绿两轴。这一章决定结论的走向，慢慢来。' },
];

export function chapterOf(type: PlateType): 0 | 1 | 2 {
  if (type === 'demonstration') return 0;
  if (type === 'transformation' || type === 'vanishing') return 1;
  return 2;
}

/* 色觉人格称号（旅人隐喻）。无对应类型时回退中性措辞。 */
export interface FunTitle {
  name: string;
  desc: string;
}

const TITLES: Record<string, FunTitle> = {
  normal: { name: '全谱旅人', desc: '三条色轴都走得稳，世界的色谱在你脚下完整铺开。' },
  protanomaly: { name: '暖色缓行的旅人', desc: '暖色段的路标要更近才看清，但方向从不迷。' },
  protanopia: { name: '暖雾旅人', desc: '红与深绿的岔路并成一条，你靠明暗与位置照样走得稳。' },
  deuteranomaly: { name: '森林色偏航的旅人', desc: '绿色森林里个别路标会迟一点到达，稍加留意即可。' },
  deuteranopia: { name: '林间旅人', desc: '红绿在你眼里更像大地色系，你是用形状与位置导航的行家。' },
  tritanomaly: { name: '暮色缓行的旅人', desc: '蓝绿色段偶尔含糊，白昼里几乎无人察觉。' },
  tritanopia: { name: '暮色旅人', desc: '蓝与绿的河岸彼此靠近，明度是你的罗盘。' },
  achromatopsia: { name: '光影旅人', desc: '世界以明暗层次展开，你比多数人更懂灰阶的诗意。' },
  inconclusive: { name: '雾中旅人', desc: '这次的雾太浓，结论暂时收起；换个环境再来一次。' },
};

/** 由判读结果取称号；funMode 关闭或无匹配时返回 null（调用方回退中性文案） */
export function funTitle(type: DeficiencyType, overall: Overall, funMode: boolean): FunTitle | null {
  if (!funMode) return null;
  const key = type ?? (overall === 'inconclusive' ? 'inconclusive' : 'normal');
  return TITLES[key] ?? null;
}

/* 三轴日常场景科普（结果页维度条点击展开） */
export const DIM_SCENES: Record<AxisKey, { title: string; items: string[] }> = {
  protan: {
    title: '红色觉偏移时，生活里会发生什么',
    items: [
      '草莓、红烧肉的「熟没熟」判断偏难，红与深棕容易混。',
      '红色刹车灯的辨识距离略短，跟车保持更远车距更安全。',
      '夕阳与晚霞的层次感稍弱，但橙金的暖调依然完整。',
    ],
  },
  deutan: {
    title: '绿色觉偏移时，生活里会发生什么',
    items: [
      '香蕉的生熟、肉类的新鲜度更依赖触感与气味辅助判断。',
      '草地、树叶之间的色差被压缩，远山像一整块绿色。',
      '红绿灯依然可靠——位置（上红下绿）是比颜色更稳的线索。',
    ],
  },
  tritan: {
    title: '蓝色觉偏移时，生活里会发生什么',
    items: [
      '青色与绿色系偶尔混淆，是三轴中最少见的一类。',
      '天空与海面的渐变层次被压平，但明暗变化依然清晰。',
      '淡黄与浅灰难以区分，主要影响精细辨色场景。',
    ],
  },
};
