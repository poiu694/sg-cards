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
const STATUS_STYLE: Record<ProfileStatus, { color: string; bg: string }> = {
  '모집중': { color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)' },
  '매칭완료': { color: 'rgba(255,255,255,0.35)', bg: 'rgba(255,255,255,0.06)' },
  '숨김': { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  '대기중': { color: '#C9A84C', bg: 'rgba(201,168,76,0.12)' },
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
      <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span className="text-4xl block mb-3">📋</span>
        <p>등록된 프로필이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>
            <th className="pl-4 pr-2 py-3 text-left w-8">
              <input type="checkbox" checked={selected.length === profiles.length && profiles.length > 0} onChange={toggleAll} className="rounded" />
            </th>
            <th className="px-3 py-3 text-left">번호</th>
            <th className="px-3 py-3 text-left">정보</th>
            <th className="px-3 py-3 text-left">직업</th>
            <th className="px-3 py-3 text-left">상태</th>
            <th className="px-3 py-3 text-center">핀</th>
            <th className="px-3 py-3 text-center">찜</th>
            <th className="px-3 py-3 text-left">등록자</th>
            <th className="px-3 py-3 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => {
            const st = STATUS_STYLE[profile.status];
            return (
              <tr
                key={profile.id}
                className="transition-colors"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  background: selected.includes(profile.id) ? 'rgba(201,168,76,0.06)' : 'transparent',
                }}
              >
                <td className="pl-4 pr-2 py-3">
                  <input type="checkbox" checked={selected.includes(profile.id)} onChange={() => toggleSelect(profile.id)} className="rounded" />
                </td>
                <td className="px-3 py-3">
                  <span className="font-bold text-white">{profile.gender === '남성' ? '♂' : '♀'} {String(profile.number).padStart(2, '0')}</span>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{getKoreanAge(profile.birthYear)}세 · {profile.location}</p>
                </td>
                <td className="px-3 py-3">
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.height}cm · {profile.mbti}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{profile.personality}</p>
                </td>
                <td className="px-3 py-3">
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.jobCategory}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{profile.job}</p>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={profile.status}
                    onChange={e => onStatusChange(profile.id, e.target.value as ProfileStatus)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer outline-none"
                    style={{ background: st.bg, color: st.color }}
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
                <td className="px-3 py-3 text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  ❤️ {profile.heartCount}
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {profile.registrant || '-'}
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(profile)}
                      className="text-xs tap-target px-2 py-1 rounded-lg transition-colors"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      수정
                    </button>
                    {confirmDelete === profile.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => { onDelete(profile.id); setConfirmDelete(null); }}
                          className="text-xs tap-target px-2 py-1 rounded-lg"
                          style={{ color: '#f87171', background: 'rgba(248,113,113,0.12)' }}
                        >
                          확인
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs tap-target px-2 py-1"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(profile.id)}
                        className="text-xs tap-target px-2 py-1 rounded-lg"
                        style={{ color: '#f87171' }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
