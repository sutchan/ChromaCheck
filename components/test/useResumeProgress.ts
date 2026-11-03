// components/test/useResumeProgress.ts — 进度恢复（mounted 水合守卫 + localStorage 草稿恢复）
// chromacheck v1.11.2
'use client';

import { useEffect, useRef, useState } from 'react';
import { loadProgress } from '@/lib/storage';
import type { AnswerRecord } from '@/lib/types';

export interface ResumeDraft {
  index: number;
  answers: AnswerRecord[];
}

/**
 * 统一的「恢复未完成检测」逻辑：避免 SSR 水合不一致（mounted 守卫）+ 从 localStorage 恢复草稿。
 * 此前在 TestRunner / AdvancedRunner 中各自重复实现，现收敛于此（R8 反模式修复）。
 */
export function useResumeProgress(mode: string, maxIndex: number) {
  const [mounted, setMounted] = useState(false);
  const [initial, setInitial] = useState<ResumeDraft | undefined>(undefined);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const p = loadProgress();
    if (p && p.mode === mode && p.index < maxIndex) {
      startedAtRef.current = p.startedAt ?? Date.now();
      setInitial({ index: p.index, answers: p.answers });
    }
    setMounted(true);
    // maxIndex 为题库长度，运行期稳定；mode 变化时重新评估
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return { mounted, initial, setInitial, startedAtRef };
}
