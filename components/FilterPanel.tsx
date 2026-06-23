'use client';
import { cn } from '@/lib/utils';

type GenderFilter = '전체' | '남성' | '여성';

interface FilterPanelProps {
  genderFilter: GenderFilter;
  onGenderChange: (g: GenderFilter) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  maleCount?: number;
  femaleCount?: number;
  totalCount?: number;
}

export default function FilterPanel({
  genderFilter, onGenderChange, showFavorites, onToggleFavorites,
  favoritesCount, maleCount = 0, femaleCount = 0, totalCount = 0,
}: FilterPanelProps) {
  const tabs = [
    { label: '전체', value: '전체' as GenderFilter, count: totalCount },
    { label: '남성', value: '남성' as GenderFilter, count: maleCount },
    { label: '여성', value: '여성' as GenderFilter, count: femaleCount },
  ];

  return (
    <div className="sticky top-0 z-20 px-4 py-3" style={{ background: 'rgba(8,11,26,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="max-w-lg mx-auto flex items-center gap-2">
        {/* Gender tabs */}
        <div className="flex gap-2 flex-1">
          {tabs.map(tab => {
            const active = genderFilter === tab.value && !showFavorites;
            return (
              <button
                key={tab.value}
                onClick={() => { onGenderChange(tab.value); if (showFavorites) onToggleFavorites(); }}
                className={cn('flex-1 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-200')}
                style={{
                  background: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.06)',
                  color: active ? '#C9A84C' : 'rgba(255,255,255,0.45)',
                  border: active ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent',
                }}
              >
                {tab.label} {tab.count}
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        <button
          onClick={onToggleFavorites}
          className="px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap"
          style={{
            background: showFavorites ? 'rgba(251,96,130,0.2)' : 'rgba(255,255,255,0.06)',
            color: showFavorites ? '#FC93A8' : 'rgba(255,255,255,0.45)',
            border: showFavorites ? '1px solid rgba(251,96,130,0.4)' : '1px solid transparent',
          }}
        >
          {showFavorites ? '❤️' : '🤍'}{favoritesCount > 0 && ` ${favoritesCount}`}
        </button>
      </div>
    </div>
  );
}
