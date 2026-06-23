'use client';
import { useState } from 'react';
import { Profile, ProfileStatus } from '@/lib/types';
import { getKoreanAge } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProfileTableProps {
  profiles: Profile[];
  selected: string[];
  onSelectChange: (ids: string[]) => void;
  onStatusChange: (id: string, status: ProfileStatus) => void;
  onPinToggle: (id: string, pinned: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (profile: Profile) => void;
}

const STATUS_OPTIONS: ProfileStatus[] = ['모집중', '매칭완료', '숨김', '대기중'];
const STATUS_COLOR: Record<ProfileStatus, string> = {
  '모집중': 'text-emerald-600 bg-emerald-50',
  '매칭완료': 'text-gray-500 bg-gray-50',
  '숨김': 'text-red-500 bg-red-50',
  '대기중': 'text-amber-600 bg-amber-50',
};

export default function ProfileTable({
  profiles, selected, onSelectChange, onStatusChange, onPinToggle, onDelete, onEdit,
}: ProfileTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    onSelectChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const toggleAll = () => {
    onSelectChange(selected.length === profiles.length ? [] : profiles.map(p => p.id));
  };

  if (!profiles.length) {
    return (
      <div className="text-center py-16 text-navy/40">
        <span className="text-4xl block mb-3">📋</span>
        <p>등록된 프로필이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-navy/5 text-navy/60 text-xs font-semibold">
            <th className="pl-4 pr-2 py-3 text-left w-8">
              <input type="checkbox" checked={selected.length === profiles.length && profiles.length > 0} onChange={toggleAll} className="rounded" />
            </th>
            <th className="px-3 py-3 text-left">번호</th>
            <th className="px-3 py-3 text-left">정보</th>
            <th className="px-3 py-3 text-left">직업</th>
            <th className="px-3 py-3 text-left">상태</th>
            <th className="px-3 py-3 text-center">핀</th>
            <th className="px-3 py-3 text-center">찜</th>
            <th className="px-3 py-3 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => (
            <tr
              key={profile.id}
              className={cn(
                'border-t border-black/5 transition-colors',
                selected.includes(profile.id) ? 'bg-gold/5' : 'bg-white hover:bg-navy/2',
              )}
            >
              <td className="pl-4 pr-2 py-3">
                <input type="checkbox" checked={selected.includes(profile.id)} onChange={() => toggleSelect(profile.id)} className="rounded" />
              </td>
              <td className="px-3 py-3">
                <span className="font-bold text-navy">{profile.gender === '남성' ? '♂' : '♀'} {String(profile.number).padStart(2, '0')}</span>
                <p className="text-navy/40 text-xs mt-0.5">{getKoreanAge(profile.birthYear)}세 · {profile.location}</p>
              </td>
              <td className="px-3 py-3">
                <p className="text-navy">{profile.height}cm · {profile.mbti}</p>
                <p className="text-navy/40 text-xs">{profile.personality}</p>
              </td>
              <td className="px-3 py-3">
                <p className="text-navy">{profile.jobCategory}</p>
                <p className="text-navy/40 text-xs">{profile.job}</p>
              </td>
              <td className="px-3 py-3">
                <select
                  value={profile.status}
                  onChange={e => onStatusChange(profile.id, e.target.value as ProfileStatus)}
                  className={cn('text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer outline-none', STATUS_COLOR[profile.status])}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-3 py-3 text-center">
                <button
                  onClick={() => onPinToggle(profile.id, !profile.isPinned)}
                  className="text-xl tap-target"
                  title={profile.isPinned ? '핀 해제' : '핀 설정'}
                >
                  {profile.isPinned ? '⭐' : '☆'}
                </button>
              </td>
              <td className="px-3 py-3 text-center">
                <span className="text-navy/60 text-xs">❤️ {profile.heartCount}</span>
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(profile)} className="text-xs text-navy/60 hover:text-navy tap-target px-2 py-1 rounded-lg hover:bg-navy/5">
                    수정
                  </button>
                  {confirmDelete === profile.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => { onDelete(profile.id); setConfirmDelete(null); }} className="text-xs text-red-600 tap-target px-2 py-1 rounded-lg bg-red-50">
                        확인
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs text-navy/40 tap-target px-2 py-1">
                        취소
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(profile.id)} className="text-xs text-red-400 hover:text-red-600 tap-target px-2 py-1 rounded-lg hover:bg-red-50">
                      삭제
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
