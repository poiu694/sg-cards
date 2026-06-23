'use client';
import { cn } from '@/lib/utils';

type GenderFilter = '전체' | '남성' | '여성';

interface FilterPanelProps {
  genderFilter: GenderFilter;
  onGenderChange: (g: GenderFilter) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

const TABS: { label: string; value: GenderFilter }[] = [
  { label: '전체', value: '전체' },
  { label: '♂ 남성', value: '남성' },
  { label: '♀ 여성', value: '여성' },
];

export default function FilterPanel({
  genderFilter, onGenderChange, showFavorites, onToggleFavorites, favoritesCount,
}: FilterPanelProps) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
        {/* Gender tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-1">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { onGenderChange(tab.value); if (showFavorites) onToggleFavorites(); }}
              className={cn(
                'flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                genderFilter === tab.value && !showFavorites
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Favorites */}
        <button
          onClick={onToggleFavorites}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap',
            showFavorites ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500',
          )}
        >
          <span>{showFavorites ? '❤️' : '🤍'}</span>
          {favoritesCount > 0 && (
            <span className={showFavorites ? 'text-white/80 text-xs' : 'text-rose-500 text-xs'}>
              {favoritesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
