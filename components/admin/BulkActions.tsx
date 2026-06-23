'use client';
import { ProfileStatus } from '@/lib/types';

interface BulkActionsProps {
  selectedCount: number;
  onBulkStatus: (status: ProfileStatus) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const BULK_STATUS_OPTIONS: { label: string; value: ProfileStatus; color: string; bg: string }[] = [
  { label: '모집중', value: '모집중', color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)' },
  { label: '매칭완료', value: '매칭완료', color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.07)' },
  { label: '숨김', value: '숨김', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
];

export default function BulkActions({ selectedCount, onBulkStatus, onBulkDelete, onClearSelection }: BulkActionsProps) {
  if (!selectedCount) return null;

  return (
    <div className="rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
      <span className="font-semibold text-sm shrink-0" style={{ color: '#C9A84C' }}>{selectedCount}개 선택됨</span>
      <div className="flex gap-2 flex-wrap flex-1">
        {BULK_STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onBulkStatus(opt.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full tap-target"
            style={{ color: opt.color, background: opt.bg }}
          >
            → {opt.label}
          </button>
        ))}
        <button
          onClick={onBulkDelete}
          className="text-xs font-semibold px-3 py-1.5 rounded-full tap-target"
          style={{ color: '#f87171', background: 'rgba(248,113,113,0.12)' }}
        >
          삭제
        </button>
      </div>
      <button onClick={onClearSelection} className="text-sm tap-target ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
        ✕
      </button>
    </div>
  );
}
