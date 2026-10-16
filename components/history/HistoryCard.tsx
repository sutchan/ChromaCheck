// components/history/HistoryCard.tsx — 单条历史结果卡片（从 app/history/page.tsx 抽取）
// chromacheck v1.9.1
import Link from 'next/link';
import type { Overall, TestResult } from '@/lib/types';
import type { Lang } from '@/lib/i18n';
import { uiText } from '@/lib/scoring';
import { formatDate } from '@/lib/format';
import { getProfileName, getDefaultProfile } from '@/lib/profile';
import { Icon } from '@/components/common/Icon';
import { useLang } from '@/components/layout/LangProvider';

const TONE: Record<Overall, string> = {
  normal: 'chip-ok',
  suspected_deficiency: 'chip-warn',
  suspected_blindness: 'chip-risk',
  inconclusive: 'chip-warn',
};

function profileOf(r: TestResult, lang: Lang): string {
  return getProfileName(r.profileId ?? getDefaultProfile(lang).id, lang);
}

interface Props {
  r: TestResult;
  lang: Lang;
  showProfile: boolean;
  onRemove: (id: string) => void;
}

export function HistoryCard({ r, lang, showProfile, onRemove }: Props) {
  const { t } = useLang();
  return (
    <div
      className="card row between"
      style={{ gap: 'var(--s-3)', flexWrap: 'wrap', padding: 'var(--s-4)' }}
    >
      <Link href={`/result/${r.id}`} className="stack" style={{ gap: 4, flex: 1, minWidth: 220, color: 'var(--fg)' }}>
        <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
          <span className={`chip ${TONE[r.overall]}`}>{uiText.overall(r.overall, lang)}</span>
          <span className="chip">
            {r.ishihara && r.pathTracking && r.hueArrangement
              ? t('history.tagAdvanced')
              : r.hueArrangement
                ? t('history.tagHue')
                : r.pathTracking
                  ? t('history.tagPath')
                  : t('history.tagIshihara')}
          </span>
          {r.type && <span className="chip">{uiText.type(r.type, lang)}</span>}
          <span className="chip">{t('history.stabilityChip', { p: r.confidence })}</span>
          {showProfile && <span className="chip">{profileOf(r, lang)}</span>}
        </div>
        <span className="muted" style={{ fontSize: '0.85rem' }}>
          {formatDate(r.createdAt)} · {uiText.mode(r.testMode, lang)}
        </span>
      </Link>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ height: 38, fontSize: '0.85rem' }}
        onClick={() => onRemove(r.id)}
        aria-label={t('history.deleteAria')}
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  );
}
