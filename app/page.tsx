'use client';
import { useState, useEffect } from 'react';
import { Profile } from '@/lib/types';
import CardGrid from '@/components/CardGrid';
import FilterPanel from '@/components/FilterPanel';
import ShootingStars from '@/components/ShootingStars';

type GenderFilter = '전체' | '남성' | '여성';

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('전체');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/cards')
      .then(r => r.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setProfiles(shuffled);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    setFavorites(JSON.parse(localStorage.getItem('sg-hearts') || '[]'));
  }, []);

  useEffect(() => {
    const onStorage = () => setFavorites(JSON.parse(localStorage.getItem('sg-hearts') || '[]'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const maleCount = profiles.filter(p => p.gender === '남성').length;
  const femaleCount = profiles.filter(p => p.gender === '여성').length;

  const filtered = profiles.filter(p => {
    if (showFavorites) return favorites.includes(p.id);
    if (genderFilter !== '전체') return p.gender === genderFilter;
    return true;
  });

  return (
    <main className="min-h-screen" style={{ background: '#080B1A' }}>
      <ShootingStars />
      {/* Header */}
      <header className="px-5 pt-16 pb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          ✦ BLIND DATE MATCHING ✦
        </p>
        <h1 className="font-serif font-bold text-4xl text-white mb-2">
          소개팅 매칭 <span className="not-italic">💕</span>
        </h1>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          당신의 특별한 인연을 찾아보세요
        </p>
        {!loading && (
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              남성 {maleCount}명
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(251,96,130,0.15)', color: '#FC93A8', border: '1px solid rgba(251,96,130,0.3)' }}>
              여성 {femaleCount}명
            </span>
          </div>
        )}
      </header>

      {/* Filter */}
      <FilterPanel
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(v => !v)}
        favoritesCount={favorites.length}
        maleCount={maleCount}
        femaleCount={femaleCount}
        totalCount={profiles.length}
      />

      {/* Cards */}
      <div className="max-w-lg mx-auto px-4 py-5 pb-20">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full rounded-3xl animate-pulse h-80" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : (
          <CardGrid profiles={filtered} favorites={favorites} onFavoritesChange={setFavorites} matchScores={{}} />
        )}
      </div>
    </main>
  );
}
