// lib/questions/signal.ts — 信号灯辨识题库（驾驶场景专项，数字等效 lantern 测试）
// chromacheck v1.7.0

export type SignalOption = { label: string; value: string };

export interface SignalTask {
  id: string;
  /** light：单一色灯辨色；meaning：信号含义识别 */
  kind: 'light' | 'meaning';
  prompt: string;
  /** 待辨识的灯色（展示用）；meaning 题可留空 */
  color?: string;
  options: SignalOption[];
  /** 正确选项 value */
  answer: string;
}

// 信号标准色：红 / 绿 / 黄（含易混淆的琥珀色）
const RED = '#e23b2e';
const GREEN = '#2ecc40';
const YELLOW = '#f4c20d';
const AMBER = '#f59e0b';

const COLORS3: SignalOption[] = [
  { label: '红', value: 'red' },
  { label: '绿', value: 'green' },
  { label: '黄', value: 'yellow' },
];

export function getSignalTasks(): SignalTask[] {
  return [
    { id: 's1', kind: 'light', prompt: '请辨认下方信号灯的颜色', color: RED, options: COLORS3, answer: 'red' },
    { id: 's2', kind: 'light', prompt: '请辨认下方信号灯的颜色', color: GREEN, options: COLORS3, answer: 'green' },
    { id: 's3', kind: 'light', prompt: '请辨认下方信号灯的颜色', color: YELLOW, options: COLORS3, answer: 'yellow' },
    { id: 's4', kind: 'light', prompt: '请辨认下方信号灯的颜色', color: RED, options: COLORS3, answer: 'red' },
    { id: 's5', kind: 'light', prompt: '请辨认下方信号灯的颜色（注意与红色区分）', color: AMBER, options: COLORS3, answer: 'yellow' },
    { id: 's6', kind: 'light', prompt: '请辨认下方信号灯的颜色', color: GREEN, options: COLORS3, answer: 'green' },
    {
      id: 's7',
      kind: 'meaning',
      prompt: '红灯亮起时，车辆应当：',
      options: [
        { label: '通行', value: 'go' },
        { label: '停止', value: 'stop' },
        { label: '加速通过', value: 'speed' },
      ],
      answer: 'stop',
    },
    {
      id: 's8',
      kind: 'meaning',
      prompt: '黄灯（或闪烁黄灯）通常表示：',
      options: [
        { label: '立即停车', value: 'stop' },
        { label: '警示 / 谨慎通过', value: 'caution' },
        { label: '快速通行', value: 'go' },
      ],
      answer: 'caution',
    },
    {
      id: 's9',
      kind: 'meaning',
      prompt: '夜间行车，前方车辆亮起的红色尾灯（刹车灯）表示它正在：',
      options: [
        { label: '加速', value: 'speed' },
        { label: '减速或制动', value: 'brake' },
        { label: '转弯', value: 'turn' },
      ],
      answer: 'brake',
    },
  ];
}
