// lib/fun.ts — 趣味性数据与文案（移植自 prototype data.js §6.5，受「趣味体验」开关控制）
// chromacheck v1.15.0
import type { AxisKey, DeficiencyType, Overall, PlateType } from './types';
import type { Lang } from './i18n';

/** 边界：答题中永不显示对错；称号为旅人隐喻、去污名化，仅本机展示，可随开关关闭。 */

/** 内容型文案（简/英双语）：展示处经 loc(text, lang) 取当前语言；繁体（zh-TW）回退简体（SPEC §8.5） */
export interface LocalizedText {
  zh: string;
  'zh-TW': string;
  en: string;
}

export function loc(text: LocalizedText, lang: Lang): string {
  if (lang === 'en') return text.en || text.zh;
  return lang === 'zh-TW' ? text['zh-TW'] || text.zh : text.zh;
}

/* 检测章节（按题型分组）：0 暖身 / 1 主体 / 2 深水 */
export interface Chapter {
  name: LocalizedText;
  icon: string;
  copy: LocalizedText;
}

export const CHAPTERS: Chapter[] = [
  {
    name: { zh: '热身 · 读懂规则', 'zh-TW': "熱身 · 讀懂規則", en: 'Warm-up · learn the rules' },
    icon: '◍',
    copy: {
      zh: '演示图人人可见，用来确认你理解了玩法——读出数字，读不出就选「看不清」。', 'zh-TW': "演示圖人人可見，用來確認你理解了玩法——讀出數字，讀不出就選「看不清」。",
      en: 'The demo plate is visible to everyone — it confirms you understand the game: read the digits, or pick “Not sure”.',
    },
  },
  {
    name: { zh: '主体 · 分岔的数字', 'zh-TW': "主體 · 分岔的數字", en: 'Main · forking digits' },
    icon: '⌁',
    copy: {
      zh: '转换题看你把它读成什么，消失题看你是否读得出。第一反应最准，不要盯太久。', 'zh-TW': "轉換題看你把它讀成什麼，消失題看你是否讀得出。第一反應最準，不要盯太久。",
      en: 'Transformation items test what you read; vanishing items test whether you read anything. Your first reaction is the most accurate — do not stare too long.',
    },
  },
  {
    name: { zh: '深水 · 类型判定', 'zh-TW': "深水 · 型別判定", en: 'Deep end · type verdict' },
    icon: '◒',
    copy: {
      zh: '隐藏题反向探测，分类题区分红绿两轴。这一章决定结论的走向，慢慢来。', 'zh-TW': "隱藏題反向探測，分類題區分紅綠兩軸。這一章決定結論的走向，慢慢來。",
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
    name: { zh: '全谱旅人', 'zh-TW': "全譜旅人", en: 'Full-spectrum traveler' },
    desc: { zh: '三条色轴都走得稳，世界的色谱在你脚下完整铺开。', 'zh-TW': "三條色軸都走得穩，世界的色譜在你腳下完整鋪開。", en: 'Steady on all three axes — the world’s full spectrum unfolds at your feet.' },
  },
  protanomaly: {
    name: { zh: '暖色缓行的旅人', 'zh-TW': "暖色緩行的旅人", en: 'Warm-path traveler' },
    desc: { zh: '暖色段的路标要更近才看清，但方向从不迷。', 'zh-TW': "暖色段的路標要更近才看清，但方向從不迷。", en: 'Warm-colored signposts need to be closer to read, but you never lose direction.' },
  },
  protanopia: {
    name: { zh: '暖雾旅人', 'zh-TW': "暖霧旅人", en: 'Warm-fog traveler' },
    desc: { zh: '红与深绿的岔路并成一条，你靠明暗与位置照样走得稳。', 'zh-TW': "紅與深綠的岔路併成一條，你靠明暗與位置照樣走得穩。", en: 'Red and dark green merge into one fork; you navigate by lightness and position just as steadily.' },
  },
  deuteranomaly: {
    name: { zh: '森林色偏航的旅人', 'zh-TW': "森林色偏航的旅人", en: 'Forest-drift traveler' },
    desc: { zh: '绿色森林里个别路标会迟一点到达，稍加留意即可。', 'zh-TW': "綠色森林裡個別路標會遲一點到達，稍加留意即可。", en: 'Some signposts in the green forest arrive a little late — a bit of attention is all it takes.' },
  },
  deuteranopia: {
    name: { zh: '林间旅人', 'zh-TW': "林間旅人", en: 'Woodland traveler' },
    desc: { zh: '红绿在你眼里更像大地色系，你是用形状与位置导航的行家。', 'zh-TW': "紅綠在你眼裡更像大地色系，你是用形狀與位置導航的行家。", en: 'Red and green read more like earth tones to you; you navigate by shape and position like a pro.' },
  },
  tritanomaly: {
    name: { zh: '暮色缓行的旅人', 'zh-TW': "暮色緩行的旅人", en: 'Dusk traveler' },
    desc: { zh: '蓝绿色段偶尔含糊，白昼里几乎无人察觉。', 'zh-TW': "藍綠色段偶爾含糊，白晝裡幾乎無人察覺。", en: 'The blue-green stretch is occasionally vague; almost nobody notices in daylight.' },
  },
  tritanopia: {
    name: { zh: '暮色旅人', 'zh-TW': "暮色旅人", en: 'Twilight traveler' },
    desc: { zh: '蓝与绿的河岸彼此靠近，明度是你的罗盘。', 'zh-TW': "藍與綠的河岸彼此靠近，明度是你的羅盤。", en: 'The blue and green banks draw close; lightness is your compass.' },
  },
  achromatopsia: {
    name: { zh: '光影旅人', 'zh-TW': "光影旅人", en: 'Light-and-shadow traveler' },
    desc: { zh: '世界以明暗层次展开，你比多数人更懂灰阶的诗意。', 'zh-TW': "世界以明暗層次展開，你比多數人更懂灰階的詩意。", en: 'The world unfolds in shades of light; you understand the poetry of gray better than most.' },
  },
  inconclusive: {
    name: { zh: '雾中旅人', 'zh-TW': "霧中旅人", en: 'Traveler in the fog' },
    desc: { zh: '这次的雾太浓，结论暂时收起；换个环境再来一次。', 'zh-TW': "這次的霧太濃，結論暫時收起；換個環境再來一次。", en: 'The fog is too thick this time; the verdict stays folded — try again in a different setting.' },
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
    title: { zh: '红色觉偏移时，生活里会发生什么', 'zh-TW': "紅色覺偏移時，生活裡會發生什麼", en: 'What a red-axis shift looks like in daily life' },
    items: [
      {
        zh: '草莓、红烧肉的「熟没熟」判断偏难，红与深棕容易混。', 'zh-TW': "草莓、紅燒肉的「熟沒熟」判斷偏難，紅與深棕容易混。",
        en: 'Judging whether strawberries or braised pork are “done” gets harder — red and dark brown easily mix.',
      },
      {
        zh: '红色刹车灯的辨识距离略短，跟车保持更远车距更安全。', 'zh-TW': "紅色剎車燈的辨識距離略短，跟車保持更遠車距更安全。",
        en: 'Red brake lights are recognized from a slightly shorter distance — keep a longer following gap.',
      },
      {
        zh: '夕阳与晚霞的层次感稍弱，但橙金的暖调依然完整。', 'zh-TW': "夕陽與晚霞的層次感稍弱，但橙金的暖調依然完整。",
        en: 'Sunsets and evening glow lose some layering, but the warm orange-gold tones stay intact.',
      },
    ],
  },
  deutan: {
    title: { zh: '绿色觉偏移时，生活里会发生什么', 'zh-TW': "綠色覺偏移時，生活裡會發生什麼", en: 'What a green-axis shift looks like in daily life' },
    items: [
      {
        zh: '香蕉的生熟、肉类的新鲜度更依赖触感与气味辅助判断。', 'zh-TW': "香蕉的生熟、肉類的新鮮度更依賴觸感與氣味輔助判斷。",
        en: 'Ripeness of bananas and freshness of meat rely more on touch and smell.',
      },
      {
        zh: '草地、树叶之间的色差被压缩，远山像一整块绿色。', 'zh-TW': "草地、樹葉之間的色差被壓縮，遠山像一整塊綠色。",
        en: 'Color differences between grass and leaves are compressed; distant hills look like one block of green.',
      },
      {
        zh: '红绿灯依然可靠——位置（上红下绿）是比颜色更稳的线索。', 'zh-TW': "紅綠燈依然可靠——位置（上紅下綠）是比顏色更穩的線索。",
        en: 'Traffic lights stay reliable — position (red on top, green below) is a steadier cue than color.',
      },
    ],
  },
  tritan: {
    title: { zh: '蓝色觉偏移时，生活里会发生什么', 'zh-TW': "藍色覺偏移時，生活裡會發生什麼", en: 'What a blue-axis shift looks like in daily life' },
    items: [
      {
        zh: '青色与绿色系偶尔混淆，是三轴中最少见的一类。', 'zh-TW': "青色與綠色系偶爾混淆，是三軸中最少見的一類。",
        en: 'Cyan and green occasionally mix — the rarest of the three axes.',
      },
      {
        zh: '天空与海面的渐变层次被压平，但明暗变化依然清晰。', 'zh-TW': "天空與海面的漸變層次被壓平，但明暗變化依然清晰。",
        en: 'Gradient layers of sky and sea flatten out, but light-dark changes stay clear.',
      },
      {
        zh: '淡黄与浅灰难以区分，主要影响精细辨色场景。', 'zh-TW': "淡黃與淺灰難以區分，主要影響精細辨色場景。",
        en: 'Pale yellow and light gray are hard to tell apart, mainly affecting fine color tasks.',
      },
    ],
  },
};
