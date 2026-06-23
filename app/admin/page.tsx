'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, ProfileFormData, ProfileStatus } from '@/lib/types';
import ProfileTable from '@/components/admin/ProfileTable';
import AddProfileModal from '@/components/admin/AddProfileModal';
import PasteParseModal from '@/components/admin/PasteParseModal';
import BulkActions from '@/components/admin/BulkActions';

export default function AdminPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [pasteDefaults, setPasteDefaults] = useState<Partial<ProfileFormData>>({});

  const fetchProfiles = useCallback(async () => {
    const res = await fetch('/api/cards?admin=true');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setProfiles(data);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const stats = {
    total: profiles.length,
    recruiting: profiles.filter(p => p.status === '모집중').length,
    matched: profiles.filter(p => p.status === '매칭완료').length,
    hidden: profiles.filter(p => p.status === '숨김' || p.status === '대기중').length,
  };

  const handleSave = async (data: ProfileFormData) => {
    if (editProfile) {
      await fetch(`/api/cards/${editProfile.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/cards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
    }
    setEditProfile(null);
    fetchProfiles();
  };

  const handleStatusChange = async (id: string, status: ProfileStatus) => {
    await fetch(`/api/cards/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    setProfiles(ps => ps.map(p => p.id === id ? { ...p, status } : p));
  };

  const handlePinToggle = async (id: string, isPinned: boolean) => {
    const pinned = profiles.filter(p => p.isPinned && p.id !== id);
    if (isPinned && pinned.length >= 3) { alert('오늘의 Pick은 최대 3개까지 설정할 수 있어요'); return; }
    await fetch(`/api/cards/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPinned }),
    });
    setProfiles(ps => ps.map(p => p.id === id ? { ...p, isPinned } : p));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/cards/${id}`, { method: 'DELETE' });
    setProfiles(ps => ps.filter(p => p.id !== id));
    setSelected(s => s.filter(sid => sid !== id));
  };

  const handleBulkStatus = async (status: ProfileStatus) => {
    await Promise.all(selected.map(id => handleStatusChange(id, status)));
    setSelected([]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.length}개를 삭제하시겠어요?`)) return;
    await Promise.all(selected.map(handleDelete));
    setSelected([]);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <main className="min-h-screen" style={{ background: '#080B1A' }}>
      {/* Header */}
      <header className="px-4 pt-12 pb-5" style={{ background: 'rgba(28,32,64,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(201,168,76,0.8)' }}>✦ ADMIN ✦</p>
            <h1 className="font-serif text-white text-xl font-bold">관리자 대시보드</h1>
          </div>
          <div className="flex gap-2 mt-1">
            <button onClick={() => router.push('/admin/preview')} className="text-sm px-3 py-2 rounded-xl tap-target transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
              미리보기
            </button>
            <button onClick={handleLogout} className="text-sm px-3 py-2 rounded-xl tap-target transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
              로그아웃
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-4 grid grid-cols-4 gap-2">
          {[
            { label: '전체', value: stats.total, color: 'rgba(255,255,255,0.9)' },
            { label: '모집중', value: stats.recruiting, color: '#6ee7b7' },
            { label: '매칭완료', value: stats.matched, color: 'rgba(255,255,255,0.4)' },
            { label: '숨김/대기', value: stats.hidden, color: '#C9A84C' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl px-3 py-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4 pb-24">
        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setEditProfile(null); setShowAdd(true); }}
            className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl tap-target transition-all active:scale-95"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            <span>＋</span> 프로필 등록
          </button>
          <button
            onClick={() => setShowPaste(true)}
            className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl tap-target transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span>📋</span> 텍스트 붙여넣기
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl tap-target transition-all active:scale-95 ml-auto"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            🏠 사용자 화면
          </button>
        </div>

        {/* Bulk actions */}
        <BulkActions
          selectedCount={selected.length}
          onBulkStatus={handleBulkStatus}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => setSelected([])}
        />

        {/* Table */}
        {loading ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>불러오는 중...</div>
        ) : (
          <ProfileTable
            profiles={profiles}
            selected={selected}
            onSelectChange={setSelected}
            onStatusChange={handleStatusChange}
            onPinToggle={handlePinToggle}
            onDelete={handleDelete}
            onEdit={p => { setEditProfile(p); setShowAdd(true); }}
          />
        )}
      </div>

      {/* Modals */}
      <AddProfileModal
        open={showAdd}
        initial={editProfile ? { ...editProfile } : pasteDefaults}
        onClose={() => { setShowAdd(false); setEditProfile(null); setPasteDefaults({}); }}
        onSave={handleSave}
      />
      <PasteParseModal
        open={showPaste}
        onClose={() => setShowPaste(false)}
        onParsed={data => { setPasteDefaults(data); setShowPaste(false); setShowAdd(true); }}
      />
    </main>
  );
}
