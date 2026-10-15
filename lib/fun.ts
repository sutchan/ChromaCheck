// lib/fun.ts — 趣味性数据与文案（移植自 prototype data.js §6.5，受「趣味体验」开关控制）
// chromacheck v1.9.0
import type { AxisKey, DeficiencyType, Overall, PlateType } from './types';
import type { Lang } from './i18n';

/** 边界：答题中永不显示对错；称号为旅人隐喻、去污名化，仅本机展示，可随开关关闭。 */

/** 双语文案：展示处经 loc(text, lang) 取当前语言，缺失时回退中文 */
export interface LocalizedText {
  zh: string;
  en: string;
}

export function loc(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.zh;
}

/* 检测章节（按题型分组）：0 暖身 / 1 主体 / 2 深水 */
export interface Chapter {
  name: LocalizedText;
  icon: string;
  copy: LocalizedText;
}

export const CHAPTERS: Chapter[] = [
  {
    name: { zh: '热身 · 读懂规则', en: 'Warm-up · learn the rules' },
    icon: '◍',
    copy: {
      zh: '演示图人人可见，用来确认你理解了玩法——读出数字，读不出就选「看不清」。',
      en: 'The demo plate is visible to everyone — it confirms you understand the game: read the digits, or pick “Not sure”.',
    },
  },
  {
    name: { zh: '主体 · 分岔的数字', en: 'Main · forking digits' },
    icon: '⌁',
    copy: {
      zh: '转换题看你把它读成什么，消失题看你是否读得出。第一反应最准，不要盯太久。',
      en: 'Transformation items test what you read; vanishing items test whether you read anything. Your first reaction is the most accurate — do not stare too long.',
    },
  },
  {
    name: { zh: '深水 · 类型判定', en: 'Deep end · type verdict' },
    icon: '◒',
    copy: {
      zh: '隐藏题反向探测，分类题区分红绿两轴。这一章决定结论的走向，慢慢来。',
      en: 'Hidden items probe in reverse; classification items separate the red-green axes. This chapter shapes the conclusion — take your time.',
    },
  },
];

export function chapterOf(type: PlateType): 0 | 1 | 2 {
  if (type === 'demonstration') return 0;
  if (type === 'transformation' || type === 'vanishing') return 1;
  return 2;
}

/* 色觉人格称号（旅人隐喻）。无对应类型时回退中性措辞。 */
export interface FunTitle {
  name: LocalizedText;
  desc: LocalizedText;
}

const TITLES: Record<string, FunTitle> = {
  normal: {
    name: { zh: '全谱旅人', en: 'Full-spectrum traveler' },
    desc: { zh: '三条色轴都走得稳，世界的色谱在你脚下完整铺开。', en: 'Steady on all three axes — the world’s full spectrum unfolds at your feet.' },
  },
  protanomaly: {
    name: { zh: '暖色缓行的旅人', en: 'Warm-path traveler' },
    desc: { zh: '暖色段的路标要更近才看清，但方向从不迷。', en: 'Warm-colored signposts need to be closer to read, but you never lose direction.' },
  },
  protanopia: {
    name: { zh: '暖雾旅人', en: 'Warm-fog traveler' },
    desc: { zh: '红与深绿的岔路并成一条，你靠明暗与位置照样走得稳。', en: 'Red and dark green merge into one fork; you navigate by lightness and position just as steadily.' },
  },
  deuteranomaly: {
    name: { zh: '森林色偏航的旅人', en: 'Forest-drift traveler' },
    desc: { zh: '绿色森林里个别路标会迟一点到达，稍加留意即可。', en: 'Some signposts in the green forest arrive a little late — a bit of attention is all it takes.' },
  },
  deuteranopia: {
    name: { zh: '林间旅人', en: 'Woodland traveler' },
    desc: { zh: '红绿在你眼里更像大地色系，你是用形状与位置导航的行家。', en: 'Red and green read more like earth tones to you; you navigate by shape and position like a pro.' },
  },
  tritanomaly: {
    name: { zh: '暮色缓行的旅人', en: 'Dusk traveler' },
    desc: { zh: '蓝绿色段偶尔含糊，白昼里几乎无人察觉。', en: 'The blue-green stretch is occasionally vague; almost nobody notices in daylight.' },
  },
  tritanopia: {
    name: { zh: '暮色旅人', en: 'Twilight traveler' },
    desc: { zh: '蓝与绿的河岸彼此靠近，明度是你的罗盘。', en: 'The blue and green banks draw close; lightness is your compass.' },
  },
  achromatopsia: {
    name: { zh: '光影旅人', en: 'Light-and-shadow traveler' },
    desc: { zh: '世界以明暗层次展开，你比多数人更懂灰阶的诗意。', en: 'The world unfolds in shades of light; you understand the poetry of gray better than most.' },
  },
  inconclusive: {
    name: { zh: '雾中旅人', en: 'Traveler in the fog' },
    desc: { zh: '这次的雾太浓，结论暂时收起；换个环境再来一次。', en: 'The fog is too thick this time; the verdict stays folded — try again in a different setting.' },
  },
};

/** 由判读结果取称号；funMode 关闭或无匹配时返回 null（调用方回退中性文案） */
export function funTitle(type: DeficiencyType, overall: Overall, funMode: boolean): FunTitle | null {
  if (!funMode) return null;
  const key = type ?? (overall === 'inconclusive' ? 'inconclusive' : 'normal');
  return TITLES[key] ?? null;
}

/* 三轴日常场景科普（结果页维度条点击展开） */
export const DIM_SCENES: Record<AxisKey, { title: LocalizedText; items: LocalizedText[] }> = {
  protan: {
    title: { zh: '红色觉偏移时，生活里会发生什么', en: 'What a red-axis shift looks like in daily life' },
    items: [
      {
        zh: '草莓、红烧肉的「熟没熟」判断偏难，红与深棕容易混。',
        en: 'Judging whether strawberries or braised pork are “done” gets harder — red and dark brown easily mix.',
      },
      {
        zh: '红色刹车灯的辨识距离略短，跟车保持更远车距更安全。',
        en: 'Red brake lights are recognized from a slightly shorter distance — keep a longer following gap.',
      },
      {
        zh: '夕阳与晚霞的层次感稍弱，但橙金的暖调依然完整。',
        en: 'Sunsets and evening glow lose some layering, but the warm orange-gold tones stay intact.',
      },
    ],
  },
  deutan: {
    title: { zh: '绿色觉偏移时，生活里会发生什么', en: 'What a green-axis shift looks like in daily life' },
    items: [
      {
        zh: '香蕉的生熟、肉类的新鲜度更依赖触感与气味辅助判断。',
        en: 'Ripeness of bananas and freshness of meat rely more on touch and smell.',
      },
      {
        zh: '草地、树叶之间的色差被压缩，远山像一整块绿色。',
        en: 'Color differences between grass and leaves are compressed; distant hills look like one block of green.',
      },
      {
        zh: '红绿灯依然可靠——位置（上红下绿）是比颜色更稳的线索。',
        en: 'Traffic lights stay reliable — position (red on top, green below) is a steadier cue than color.',
      },
    ],
  },
  tritan: {
    title: { zh: '蓝色觉偏移时，生活里会发生什么', en: 'What a blue-axis shift looks like in daily life' },
    items: [
      {
        zh: '青色与绿色系偶尔混淆，是三轴中最少见的一类。',
        en: 'Cyan and green occasionally mix — the rarest of the three axes.',
      },
      {
        zh: '天空与海面的渐变层次被压平，但明暗变化依然清晰。',
        en: 'Gradient layers of sky and sea flatten out, but light-dark changes stay clear.',
      },
      {
        zh: '淡黄与浅灰难以区分，主要影响精细辨色场景。',
        en: 'Pale yellow and light gray are hard to tell apart, mainly affecting fine color tasks.',
      },
    ],
  },
};
