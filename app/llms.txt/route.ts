// app/llms.txt/route.ts — GEO：面向生成式引擎的站点索引（llms.txt 约定）
// chromacheck v1.6.0
import { ARTICLES } from '@/lib/learn-data';

const BASE = 'https://chromacheck.app';

export const dynamic = 'force-static';

export function GET() {
  const md: string[] = [];
  md.push('# 色辨 ChromaCheck');
  md.push('');
  md.push(
    '> 在线色觉筛查 Web 应用，基于石原氏（Ishihara）等亮度检测原理，提供快速版（10 题）、标准版（38 题）、路径追踪、色相排列（D15 简化版）与进阶联合判读。结果仅供参考，不能替代专业眼科诊断。',
  );
  md.push('');
  md.push('## 主要页面');
  md.push(`- [首页](${BASE}/): 产品介绍、检测流程与色觉模拟体验`);
  md.push(`- [检测模式选择](${BASE}/test): 快速版 / 标准版 / 路径追踪 / 色相排列 / 进阶联合`);
  md.push(`- [检测前指引](${BASE}/guide): 环境、设备、距离与作答方式准备`);
  md.push(`- [科普列表](${BASE}/learn): 色觉相关知识文章`);
  md.push(`- [隐私政策](${BASE}/privacy): 数据本地化、匿名统计与免责声明`);
  md.push('');
  md.push('## 科普文章');
  for (const a of ARTICLES) {
    md.push(`- [${a.title}](${BASE}/learn/${a.slug}): ${a.excerpt}`);
  }
  md.push('');
  md.push('## 关键事实');
  md.push('- 色盲是某类视锥细胞缺失，色弱是该类细胞功能减弱。');
  md.push('- 红绿色觉异常多为 X 连锁隐性遗传，男性患病率约为女性的 16 倍。');
  md.push('- 在线筛查仅能判断异常倾向与红绿/蓝黄偏向，无法区分"盲"与"弱"，也不能作为医学诊断依据。');
  md.push('- 检测数据默认仅存于用户本机浏览器，不上传服务器。');

  return new Response(md.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
