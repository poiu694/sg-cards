'use client';
import { useState, useEffect } from 'react';
import { Profile } from '@/lib/types';
import CardGrid from '@/components/CardGrid';
import FilterPanel from '@/components/FilterPanel';

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
        setProfiles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    const saved: string[] = JSON.parse(localStorage.getItem('sg-hearts') || '[]');
    setFavorites(saved);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setFavorites(JSON.parse(localStorage.getItem('sg-hearts') || '[]'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filtered = profiles.filter(p => {
    if (showFavorites) return favorites.includes(p.id);
    if (genderFilter !== '전체') return p.gender === genderFilter;
    return true;
  });

  return (
    <main className="min-h-screen" style={{ background: '#F5F5F7' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(160deg, #1A1F3A 0%, #111827 100%)' }} className="px-5 pt-14 pb-7">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#C9A84C' }}>
          💝 Blind Date
        </p>
        <h1 className="font-serif text-white text-3xl font-bold leading-snug">
          당신의 인연을<br />
          <span className="text-gradient-gold">찾아보세요</span>
        </h1>
        <p className="text-white/40 text-sm mt-3">
          {loading ? '불러오는 중...' : `${profiles.length}명의 후보`}
        </p>
      </header>

      {/* Filter */}
      <FilterPanel
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(v => !v)}
        favoritesCount={favorites.length}
      />

      {/* Grid */}
      <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 py-5 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full rounded-3xl bg-gray-200 animate-pulse" style={{ aspectRatio: '3/4' }} />
            ))}
          </div>
        ) : (
          <CardGrid
            profiles={filtered}
            favorites={favorites}
            onFavoritesChange={setFavorites}
            matchScores={{}}
          />
        )}
      </div>
    </main>
  );
}
