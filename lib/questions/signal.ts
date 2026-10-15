// lib/questions/signal.ts — 信号灯辨识题库（驾驶场景专项，数字等效 lantern 测试）
// chromacheck v1.9.0

export type SignalOption = { label: string; labelEn: string; value: string };

export interface SignalTask {
  id: string;
  /** light：单一色灯辨色；meaning：信号含义识别 */
  kind: 'light' | 'meaning';
  prompt: string;
  /** 题干英文（v1.9.0 国际化） */
  promptEn: string;
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
  { label: '红', labelEn: 'Red', value: 'red' },
  { label: '绿', labelEn: 'Green', value: 'green' },
  { label: '黄', labelEn: 'Yellow', value: 'yellow' },
];

export function getSignalTasks(): SignalTask[] {
  return [
    { id: 's1', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptEn: 'Identify the color of the traffic light below', color: RED, options: COLORS3, answer: 'red' },
    { id: 's2', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptEn: 'Identify the color of the traffic light below', color: GREEN, options: COLORS3, answer: 'green' },
    { id: 's3', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptEn: 'Identify the color of the traffic light below', color: YELLOW, options: COLORS3, answer: 'yellow' },
    { id: 's4', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptEn: 'Identify the color of the traffic light below', color: RED, options: COLORS3, answer: 'red' },
    { id: 's5', kind: 'light', prompt: '请辨认下方信号灯的颜色（注意与红色区分）', promptEn: 'Identify the color of the traffic light below (note the difference from red)', color: AMBER, options: COLORS3, answer: 'yellow' },
    { id: 's6', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptEn: 'Identify the color of the traffic light below', color: GREEN, options: COLORS3, answer: 'green' },
    {
      id: 's7',
      kind: 'meaning',
      prompt: '红灯亮起时，车辆应当：',
      promptEn: 'When the red light is on, the vehicle should:',
      options: [
        { label: '通行', labelEn: 'Proceed', value: 'go' },
        { label: '停止', labelEn: 'Stop', value: 'stop' },
        { label: '加速通过', labelEn: 'Speed up', value: 'speed' },
      ],
      answer: 'stop',
    },
    {
      id: 's8',
      kind: 'meaning',
      prompt: '黄灯（或闪烁黄灯）通常表示：',
      promptEn: 'A yellow light (or flashing yellow) usually means:',
      options: [
        { label: '立即停车', labelEn: 'Stop immediately', value: 'stop' },
        { label: '警示 / 谨慎通过', labelEn: 'Caution / proceed carefully', value: 'caution' },
        { label: '快速通行', labelEn: 'Go quickly', value: 'go' },
      ],
      answer: 'caution',
    },
    {
      id: 's9',
      kind: 'meaning',
      prompt: '夜间行车，前方车辆亮起的红色尾灯（刹车灯）表示它正在：',
      promptEn: 'At night, the red tail lights (brake lights) of the vehicle ahead mean it is:',
      options: [
        { label: '加速', labelEn: 'Accelerating', value: 'speed' },
        { label: '减速或制动', labelEn: 'Slowing down or braking', value: 'brake' },
        { label: '转弯', labelEn: 'Turning', value: 'turn' },
      ],
      answer: 'brake',
    },
  ];
}
