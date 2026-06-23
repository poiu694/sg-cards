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
        <p className="font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>해당하는 카드가 없어요</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>다른 필터를 선택해 보세요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {profiles.map((profile, index) => (
        <ProfileCard key={profile.id} profile={profile} index={index} />
      ))}
    </div>
  );
}
