'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types';
import CardGrid from '@/components/CardGrid';

export default function AdminPreviewPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    fetch('/api/cards?admin=true')
      .then(r => { if (r.status === 401) router.push('/admin/login'); return r.json(); })
      .then((data: unknown) => { setProfiles(Array.isArray(data) ? data : []); setLoading(false); });
  }, [router]);

  const publicProfiles = profiles.filter(p => p.status === '모집중');
  const hiddenProfiles = profiles.filter(p => p.status !== '모집중');

  return (
    <main className="min-h-screen" style={{ background: '#080B1A' }}>
      {/* Admin preview banner */}
      <div className="px-4 py-2 flex items-center justify-between sticky top-0 z-30" style={{ background: 'rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.25)' }}>
        <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>👁 관리자 미리보기</span>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHidden(v => !v)}
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {showHidden ? '숨김 숨기기' : `숨김 보기 (${hiddenProfiles.length}개)`}
          </button>
          <button onClick={() => router.push('/admin')} className="text-xs font-bold" style={{ color: '#C9A84C' }}>
            ← 관리자로
          </button>
        </div>
      </div>

      <header className="px-5 pt-12 pb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          ✦ BLIND DATE MATCHING ✦
        </p>
        <h1 className="font-serif font-bold text-4xl text-white mb-2">
          소개팅 매칭 💕
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {publicProfiles.length}명의 후보가 기다리고 있어요
        </p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 pb-20">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full rounded-3xl animate-pulse h-80" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : (
          <>
            <CardGrid profiles={publicProfiles} favorites={[]} onFavoritesChange={() => {}} matchScores={{}} />
            {showHidden && hiddenProfiles.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold mb-3 px-1" style={{ color: 'rgba(255,255,255,0.3)' }}>숨김 / 대기중 / 매칭완료 (관리자만 보임)</p>
                <div className="opacity-40">
                  <CardGrid profiles={hiddenProfiles} favorites={[]} onFavoritesChange={() => {}} matchScores={{}} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
