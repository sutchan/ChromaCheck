// lib/questions/signal.ts — 信号灯辨识题库（驾驶场景专项，数字等效 lantern 测试）
// chromacheck v1.9.0

export type SignalOption = { label: string; labelTW: string; labelEn: string; value: string };

export interface SignalTask {
  id: string;
  /** light：单一色灯辨色；meaning：信号含义识别 */
  kind: 'light' | 'meaning';
  prompt: string;
  /** 题干繁体（台湾） */
  promptTW: string;
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
  { label: '红', labelTW: "紅", labelEn: 'Red', value: 'red' },
  { label: '绿', labelTW: "綠", labelEn: 'Green', value: 'green' },
  { label: '黄', labelTW: "黃", labelEn: 'Yellow', value: 'yellow' },
];

export function getSignalTasks(): SignalTask[] {
  return [
    { id: 's1', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptTW: "請辨認下方訊號燈的顏色", promptEn: 'Identify the color of the traffic light below', color: RED, options: COLORS3, answer: 'red' },
    { id: 's2', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptTW: "請辨認下方訊號燈的顏色", promptEn: 'Identify the color of the traffic light below', color: GREEN, options: COLORS3, answer: 'green' },
    { id: 's3', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptTW: "請辨認下方訊號燈的顏色", promptEn: 'Identify the color of the traffic light below', color: YELLOW, options: COLORS3, answer: 'yellow' },
    { id: 's4', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptTW: "請辨認下方訊號燈的顏色", promptEn: 'Identify the color of the traffic light below', color: RED, options: COLORS3, answer: 'red' },
    { id: 's5', kind: 'light', prompt: '请辨认下方信号灯的颜色（注意与红色区分）', promptTW: "請辨認下方訊號燈的顏色（注意與紅色區分）", promptEn: 'Identify the color of the traffic light below (note the difference from red)', color: AMBER, options: COLORS3, answer: 'yellow' },
    { id: 's6', kind: 'light', prompt: '请辨认下方信号灯的颜色', promptTW: "請辨認下方訊號燈的顏色", promptEn: 'Identify the color of the traffic light below', color: GREEN, options: COLORS3, answer: 'green' },
    {
      id: 's7',
      kind: 'meaning',
      prompt: '红灯亮起时，车辆应当：', promptTW: "紅燈亮起時，車輛應當：",
      promptEn: 'When the red light is on, the vehicle should:',
      options: [
        { label: '通行', labelTW: "通行", labelEn: 'Proceed', value: 'go' },
        { label: '停止', labelTW: "停止", labelEn: 'Stop', value: 'stop' },
        { label: '加速通过', labelTW: "加速透過", labelEn: 'Speed up', value: 'speed' },
      ],
      answer: 'stop',
    },
    {
      id: 's8',
      kind: 'meaning',
      prompt: '黄灯（或闪烁黄灯）通常表示：', promptTW: "黃燈（或閃爍黃燈）通常表示：",
      promptEn: 'A yellow light (or flashing yellow) usually means:',
      options: [
        { label: '立即停车', labelTW: "立即停車", labelEn: 'Stop immediately', value: 'stop' },
        { label: '警示 / 谨慎通过', labelTW: "警示 / 謹慎透過", labelEn: 'Caution / proceed carefully', value: 'caution' },
        { label: '快速通行', labelTW: "快速通行", labelEn: 'Go quickly', value: 'go' },
      ],
      answer: 'caution',
    },
    {
      id: 's9',
      kind: 'meaning',
      prompt: '夜间行车，前方车辆亮起的红色尾灯（刹车灯）表示它正在：', promptTW: "夜間行車，前方車輛亮起的紅色尾燈（剎車燈）表示它正在：",
      promptEn: 'At night, the red tail lights (brake lights) of the vehicle ahead mean it is:',
      options: [
        { label: '加速', labelTW: "加速", labelEn: 'Accelerating', value: 'speed' },
        { label: '减速或制动', labelTW: "減速或制動", labelEn: 'Slowing down or braking', value: 'brake' },
        { label: '转弯', labelTW: "轉彎", labelEn: 'Turning', value: 'turn' },
      ],
      answer: 'brake',
    },
  ];
}
