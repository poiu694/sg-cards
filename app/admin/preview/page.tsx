'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types';
import CardGrid from '@/components/CardGrid';
import TodayPick from '@/components/TodayPick';

export default function AdminPreviewPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    fetch('/api/cards?admin=true')
      .then(r => { if (r.status === 401) router.push('/admin/login'); return r.json(); })
      .then((data: Profile[]) => { setProfiles(data); setLoading(false); });
  }, [router]);

  const publicProfiles = profiles.filter(p => p.status === '모집중' || p.status === '매칭완료');
  const hiddenProfiles = profiles.filter(p => p.status === '숨김' || p.status === '대기중');
  const pinnedProfiles = publicProfiles.filter(p => p.isPinned);

  return (
    <main className="min-h-screen bg-cream">
      {/* Admin preview banner */}
      <div className="bg-amber-500 px-4 py-2 flex items-center justify-between sticky top-0 z-30">
        <span className="text-white text-xs font-bold">👁 관리자 미리보기</span>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHidden(v => !v)}
            className="text-white/80 text-xs"
          >
            {showHidden ? '숨김 숨기기' : `숨김 보기 (${hiddenProfiles.length}개)`}
          </button>
          <button onClick={() => router.push('/admin')} className="text-white text-xs font-bold">
            ← 관리자로
          </button>
        </div>
      </div>

      <header className="bg-navy px-4 pt-8 pb-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-1">💝 Blind Date</p>
          <h1 className="font-serif text-white text-2xl font-bold">
            당신의 인연을<span className="text-gradient-gold"> 찾아보세요</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">{publicProfiles.length}명의 후보가 기다리고 있어요</p>
        </div>
      </header>

      {!loading && pinnedProfiles.length > 0 && <TodayPick profiles={pinnedProfiles} />}

      <div className="max-w-2xl lg:max-w-5xl mx-auto px-3 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[280px] bg-blush rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <CardGrid profiles={publicProfiles} favorites={[]} onFavoritesChange={() => {}} matchScores={{}} />
            {showHidden && hiddenProfiles.length > 0 && (
              <div className="mt-6">
                <p className="text-navy/40 text-xs font-bold mb-3 px-1">숨김 / 대기중 (관리자만 보임)</p>
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
