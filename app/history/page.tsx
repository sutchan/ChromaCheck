// app/history/page.tsx — 历史记录
// chromacheck v1.3.0
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listResults, deleteResult, clearResults } from '@/lib/storage';
import { uiText } from '@/lib/scoring';
import { formatDate } from '@/lib/format';
import type { Overall, TestResult } from '@/lib/types';
import { Icon } from '@/components/common/Icon';
import { Callout } from '@/components/common/Callout';

const TONE: Record<Overall, string> = {
  normal: 'chip-ok',
  suspected_deficiency: 'chip-warn',
  suspected_blindness: 'chip-risk',
  inconclusive: 'chip-warn',
};

export default function HistoryPage() {
  const [items, setItems] = useState<TestResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(listResults());
    setLoaded(true);
  }, []);

  function remove(id: string) {
    deleteResult(id);
    setItems(listResults());
  }

  return (
    <div id="history-page" className="wrap stack" style={{ paddingBlock: 'var(--s-6)', gap: 'var(--s-5)' }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-3)' }}>
        <div className="stack" style={{ gap: 4 }}>
          <h1 style={{ margin: 0 }}>历史记录</h1>
          <span className="muted" style={{ fontSize: '0.9rem' }}>仅保存于本设备浏览器，最多保留最近 30 次。</span>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: '0.85rem' }}
            onClick={() => {
              if (confirm('确定清空全部历史记录？')) {
                clearResults();
                setItems([]);
              }
            }}
          >
            <Icon name="trash" size={16} /> 清空
          </button>
        )}
      </div>

      {!loaded ? (
        <div className="skel" style={{ height: 120 }} />
      ) : items.length === 0 ? (
        <div className="card stack" style={{ alignItems: 'center', textAlign: 'center', gap: 'var(--s-3)' }}>
          <Icon name="history" size={36} />
          <p className="muted" style={{ margin: 0 }}>还没有检测记录。完成一次检测后，结果会显示在这里。</p>
          <Link href="/test" className="btn btn-primary">开始第一次检测</Link>
        </div>
      ) : (
        <div className="stack" style={{ gap: 'var(--s-3)' }}>
          {items.map((r) => (
            <div key={r.id} className="card row between" style={{ gap: 'var(--s-3)', flexWrap: 'wrap', padding: 'var(--s-4)' }}>
              <Link href={`/result/${r.id}`} className="stack" style={{ gap: 4, flex: 1, minWidth: 220, color: 'var(--fg)' }}>
                <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
                  <span className={`chip ${TONE[r.overall]}`}>{uiText.overall(r.overall)}</span>
                  <span className="chip">
                    {r.ishihara && r.pathTracking && r.hueArrangement
                      ? '进阶联合'
                      : r.hueArrangement
                        ? '色相排列'
                        : r.pathTracking
                          ? '路径追踪'
                          : '石原氏'}
                  </span>
                  {r.type && <span className="chip">{uiText.type(r.type)}</span>}
                  <span className="chip">置信度 {r.confidence}%</span>
                </div>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  {formatDate(r.createdAt)} · {uiText.mode(r.testMode)}
                </span>
              </Link>
              <button type="button" className="btn btn-ghost" style={{ height: 38, fontSize: '0.85rem' }} onClick={() => remove(r.id)} aria-label="删除该记录">
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Callout icon="shield">历史记录不会上传服务器，完全保存在你的浏览器本地。清除浏览器数据或更换设备后记录将不可恢复。</Callout>
    </div>
  );
}
