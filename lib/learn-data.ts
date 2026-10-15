// lib/learn-data.ts — 科普文章（移植自 prototype/data.js 并补充正文）
// chromacheck v1.9.0

export interface LearnSection {
  h?: string;
  /** 小标题英文（v1.9.0 国际化；h 存在时提供） */
  hEn?: string;
  p: string;
  /** 正文英文（v1.9.0 国际化） */
  pEn: string;
}
export interface Article {
  slug: string;
  title: string;
  /** 标题英文（v1.9.0 国际化） */
  titleEn: string;
  cat: string;
  /** 分类英文（v1.9.0 国际化） */
  catEn: string;
  read: string;
  hue: string;
  excerpt: string;
  /** 摘要英文（v1.9.0 国际化） */
  excerptEn: string;
  body: LearnSection[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'what-is-color-blindness',
    title: '色盲和色弱，其实不是一回事',
    titleEn: 'Color blindness and color weakness are not the same thing',
    cat: '基础知识',
    catEn: 'Basics',
    read: '6 分钟',
    hue: '#6a7fc4',
    excerpt: '色盲是某类视锥细胞缺失，色弱是功能减弱。两者的成因、表现与生活影响差别很大。',
    excerptEn: 'Color blindness means a missing class of cone cells, while color weakness means reduced function. The two differ greatly in their causes, presentation and impact on daily life.',
    body: [
      { p: '很多人把"看不清红色绿色"统称为色盲，但在医学上，色盲（anopia）与色弱（anomaly）并不相同。前者是某一类视锥细胞完全缺失，后者则是细胞仍在但功能减弱、敏感度下降。', pEn: 'Many people lump together anything that makes red and green hard to tell as "color blindness," but medically color blindness (anopia) and color deficiency (anomaly) are not the same. In the former, one class of cone cells is entirely absent; in the latter, the cells are still present but function weakly, with reduced sensitivity.' },
      { h: '三色视觉的底层逻辑', hEn: 'The logic behind trichromatic vision', p: '人眼视网膜上主要有三种视锥细胞，分别对不同波长敏感，大致对应红、绿、蓝。正常色觉（三色视觉）依靠三者配合分辨 millions 种颜色；当其中一类缺失或减弱，可辨颜色数量便会大幅缩水。', pEn: 'The human retina contains three main types of cone cells, each sensitive to a different range of wavelengths and roughly corresponding to red, green and blue. Normal color vision (trichromacy) relies on all three working together to distinguish millions of colors; when one type is missing or weakened, the number of colors you can tell apart shrinks dramatically.' },
      { h: '对生活的影响', hEn: 'Impact on daily life', p: '色弱往往只是某些相近色（如深红与深绿、橙与棕）难以区分，多数职业不受影响；色盲的辨识缺口更大，可能在交通信号、地图、图表等场景需要额外辅助。', pEn: 'Color weakness usually only makes certain close hues hard to separate (such as dark red from dark green, or orange from brown), and most occupations are unaffected. Color blindness leaves a larger perceptual gap, and may call for extra support with traffic signals, maps and charts.' },
      { p: '在线筛查能大致判断是否存在异常以及偏向红绿还是蓝黄，但无法精确区分"盲"与"弱"，确诊仍需专业仪器。', pEn: 'An online screening can roughly tell whether an abnormality exists and whether it leans red-green or blue-yellow, but it cannot precisely distinguish "blindness" from "weakness." A definitive diagnosis still requires professional instruments.' },
    ],
  },
  {
    slug: 'ishihara-principle',
    title: '石原氏检测图是怎么"骗过"眼睛的',
    titleEn: 'How Ishihara plates "trick" the eye',
    cat: '检测原理',
    catEn: 'How it works',
    read: '8 分钟',
    hue: '#c9903c',
    excerpt: '同样大小、同样明暗的色点，只靠色相差异构成数字——这是等亮度设计的巧思。',
    excerptEn: 'Dots of identical size and brightness form a number through hue differences alone — the cleverness of isoluminant design.',
    body: [
      { p: '石原氏检测图由日本眼科医生石原忍于 1917 年创制。它的核心技巧是"等亮度设计"：组成数字的色点与背景色点亮度几乎一致，仅靠色相不同来区分。', pEn: 'The Ishihara plates were created in 1917 by the Japanese ophthalmologist Shinobu Ishihara. Their core trick is "isoluminant design": the dots that make up the figure and the background dots have almost identical brightness, and can be told apart only by hue.' },
      { h: '为什么色觉异常者会"看不见"', hEn: 'Why people with color vision deficiency "cannot see" it', p: '对红绿色觉异常者而言，红与绿在感知上被压缩到很近的位置，原本用来勾勒数字的色相对比消失了，数字便"融化"进背景。这正是转换题、消失题的原理。', pEn: 'For people with red-green color vision deficiency, red and green are compressed into very close positions in perception. The hue contrast that was meant to outline the figure disappears, and the number "melts" into the background. That is precisely the principle behind transformation plates and vanishing plates.' },
      { h: '题型各有用途', hEn: 'Each plate type has its purpose', p: '演示题用于校准；转换题中异常者会读出另一个数字；消失题对异常者而言数字干脆消失；隐藏题则只在特定色觉下浮现。多角度交叉，才能提高筛查的可信度。', pEn: 'Demonstration plates are used for calibration; on transformation plates, a person with a deficiency reads a different number; on vanishing plates, the number disappears altogether for them; hidden plates emerge only under a specific type of color vision. Cross-checking from multiple angles is what makes a screening more reliable.' },
    ],
  },
  {
    slug: 'inheritance',
    title: '色觉异常会遗传吗？一张图看懂规律',
    titleEn: 'Is color vision deficiency inherited? Understanding the pattern at a glance',
    cat: '遗传规律',
    catEn: 'Inheritance',
    read: '5 分钟',
    hue: '#49b295',
    excerpt: '红绿色觉异常属于 X 连锁隐性遗传，男性患病率约为女性的 16 倍。',
    excerptEn: 'Red-green color vision deficiency follows X-linked recessive inheritance, and men are affected about 16 times as often as women.',
    body: [
      { p: '最常见的红绿色觉异常基因位于 X 染色体上，属于 X 连锁隐性遗传。男性只有一条 X 染色体，一旦携带致病基因就会表现出来；女性有两条 X，需两条都带病才会显现，因此男性患病远多于女性。', pEn: 'The genes behind the most common red-green deficiencies sit on the X chromosome and follow X-linked recessive inheritance. Men have only one X chromosome, so a single disease-causing gene is enough for the condition to appear. Women have two X chromosomes and need both to carry it before it shows, which is why far more men than women are affected.' },
      { h: '家庭传递示意', hEn: 'How it passes through a family', p: '若母亲是携带者（XᴬXᵃ）、父亲正常（XᴬY），儿子有 50% 概率患病，女儿则有 50% 成为携带者。这也是为什么"外公—外孙"之间常见隔代传递。', pEn: 'If the mother is a carrier (XᴬXᵃ) and the father is unaffected (XᴬY), each son has a 50% chance of being affected and each daughter has a 50% chance of becoming a carrier. This is also why the condition is often passed down across generations, from grandfather to grandson.' },
      { p: '蓝黄色觉异常多为常染色体遗传，与性别无关，相对少见。', pEn: 'Blue-yellow color vision deficiencies are mostly autosomal, unrelated to sex, and relatively uncommon.' },
    ],
  },
  {
    slug: 'career-limits',
    title: '哪些专业和职业对色觉有明确要求',
    titleEn: 'Which majors and professions have explicit color vision requirements',
    cat: '职业相关',
    catEn: 'Careers',
    read: '7 分钟',
    hue: '#bb5566',
    excerpt: '梳理高考体检、驾驶证申领与部分行业的色觉要求，附官方文件依据。',
    excerptEn: 'A summary of color vision requirements in the college entrance medical examination, driver’s licence applications and selected industries, with references to official documents.',
    body: [
      { p: '在我国，色觉检查是高考体检与部分职业准入的常规项目。限制主要出于安全与判别准确性考虑，并非歧视。', pEn: 'In China, color vision testing is a routine part of the college entrance medical examination and of the entry requirements for certain occupations. The restrictions mainly reflect safety and the need for accurate discrimination; they are not a form of discrimination.' },
      { h: '常见受限方向', hEn: 'Commonly restricted fields', p: '美术、医学、化学、交通运输、军事公安、某些工科专业会对色觉提出要求；驾驶方面，红绿色觉异常者通常不得申领大型车辆驾驶证，小型汽车也有相应限制。', pEn: 'Fine arts, medicine, chemistry, transportation, military and public security work, and some engineering majors all impose color vision requirements. When it comes to driving, people with red-green deficiencies are generally not eligible for a large-vehicle licence, and there are corresponding restrictions for passenger cars as well.' },
      { p: '具体标准以当年教育、卫健、公安等部门发布的文件为准。筛查结果仅作参考，最终以指定机构的体检结论为准。', pEn: 'For the exact standards, refer to the documents issued that year by the education, health and public security authorities. Screening results are indicative only; the final word rests with the medical examination conclusion issued by a designated institution.' },
    ],
  },
  {
    slug: 'daily-tips',
    title: '色觉异常者的 12 个生活小技巧',
    titleEn: '12 practical tips for people with color vision deficiency',
    cat: '生活贴士',
    catEn: 'Daily tips',
    read: '5 分钟',
    hue: '#3fa8b8',
    excerpt: '从挑衣服到读图表，用标签、明度和位置替代色相，可以解决大部分困扰。',
    excerptEn: 'From choosing clothes to reading charts, replacing hue with labels, brightness and position solves most of the difficulty.',
    body: [
      { p: '色相不是区分信息的唯一维度。善用明度、饱和度、文字标签与空间位置，绝大多数日常场景都能找到替代方案。', pEn: 'Hue is not the only dimension for telling information apart. By making good use of brightness, saturation, text labels and spatial position, you can find a workaround for the vast majority of everyday situations.' },
      { h: '可立即上手的做法', hEn: 'Things you can put into practice right away', p: '给电线贴编号、用"熟/生"而非"红/绿"标注肉类、挑选衣物时对比明暗而非色名、在图表中叠加纹理或数值。手机的无障碍模式与多数地图 App 也提供色觉友好配色。', pEn: 'Label wires with numbers; mark meat as "done/raw" rather than "red/green"; compare light and dark instead of color names when choosing clothes; overlay texture or values on charts. Accessibility modes on phones and most map apps also offer color-vision-friendly palettes.' },
      { p: '把"我分不清这两种颜色"直说出口，往往比自己猜更高效，也能获得周围人的理解。', pEn: 'Saying "I can’t tell these two colors apart" out loud is usually more efficient than guessing, and it helps the people around you understand.' },
    ],
  },
  {
    slug: 'when-to-see-doctor',
    title: '什么情况需要去医院做专业检查',
    titleEn: 'When you should see a doctor for a professional examination',
    cat: '就医指南',
    catEn: 'When to see a doctor',
    read: '4 分钟',
    hue: '#87ad4c',
    excerpt: '在线筛查只是第一步，出现这些信号建议尽快到眼科做进一步检查。',
    excerptEn: 'Online screening is only a first step; if these signs appear, it is best to see an ophthalmologist for further testing as soon as possible.',
    body: [
      { p: '在线自测方便、可重复，但它只是筛查，不能替代诊断。若你或家人在生活中频繁出现以下情况，建议预约眼科的色觉专项检查。', pEn: 'Online self-tests are convenient and repeatable, but they are only screening and cannot replace a diagnosis. If you or a family member frequently run into the situations below, book a dedicated color vision examination with an ophthalmologist.' },
      { h: '建议就医的信号', hEn: 'Signs that warrant a visit', p: '经常把红绿信号、指示灯弄混；某些职业体检要求出具正规报告；儿童在看图、涂色时持续表现出辨色困难；或成年后突然出现辨色能力下降（后者需优先排除眼部或神经病变）。', pEn: 'Frequently confusing red-green signals or indicator lights; a pre-employment medical examination that requires a formal report; a child who consistently struggles to tell colors apart when looking at pictures or coloring; or a sudden decline in color discrimination in adulthood (in the last case, eye or neurological disease must be ruled out first).' },
      { p: '专业检查包含假同色图、色相排列（如 D-15）、 anomaloscope 等，能更精确地分型与分级。', pEn: 'A professional examination includes pseudoisochromatic plates, hue arrangement tests such as the D-15, and the anomaloscope, which allow the condition to be classified and graded more precisely.' },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
