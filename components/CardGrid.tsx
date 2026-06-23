'use client';
import { Profile } from '@/lib/types';
import ProfileCard from './ProfileCard';

interface CardGridProps {
  profiles: Profile[];
  favorites: string[];
  onFavoritesChange: (ids: string[]) => void;
  matchScores: Record<string, number>;
}

export default function CardGrid({ profiles }: CardGridProps) {
  if (!profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl mb-4">💔</span>
        <p className="text-gray-500 font-medium">해당하는 카드가 없어요</p>
        <p className="text-gray-400 text-sm mt-1">다른 필터를 선택해 보세요</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile, index) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          index={index}
        />
      ))}
    </div>
  );
}
