'use client';
import { ProfileStatus } from '@/lib/types';

interface BulkActionsProps {
  selectedCount: number;
  onBulkStatus: (status: ProfileStatus) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const BULK_STATUS_OPTIONS: { label: string; value: ProfileStatus; color: string }[] = [
  { label: '모집중', value: '모집중', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { label: '매칭완료', value: '매칭완료', color: 'text-gray-600 bg-gray-50 border-gray-200' },
  { label: '숨김', value: '숨김', color: 'text-red-600 bg-red-50 border-red-200' },
];

export default function BulkActions({ selectedCount, onBulkStatus, onBulkDelete, onClearSelection }: BulkActionsProps) {
  if (!selectedCount) return null;

  return (
    <div className="bg-navy rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap">
      <span className="text-white font-semibold text-sm shrink-0">{selectedCount}개 선택됨</span>
      <div className="flex gap-2 flex-wrap flex-1">
        {BULK_STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onBulkStatus(opt.value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border tap-target ${opt.color}`}
          >
            → {opt.label}
          </button>
        ))}
        <button
          onClick={onBulkDelete}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border text-red-600 bg-red-50 border-red-200 tap-target"
        >
          삭제
        </button>
      </div>
      <button onClick={onClearSelection} className="text-white/40 text-sm tap-target ml-auto">
        ✕
      </button>
    </div>
  );
}
