'use client';
import Image from 'next/image';
import { Profile } from '@/lib/types';
import { getAvatarUrl, getKoreanAge, getMbtiColors, formatNumber } from '@/lib/utils';

interface CardFrontProps {
  profile: Profile;
}

export default function CardFront({ profile }: CardFrontProps) {
  const avatarUrl = profile.photoUrl || getAvatarUrl(profile.id, profile.gender);
  const age = getKoreanAge(profile.birthYear);
  const isMale = profile.gender === '남성';

  return (
    <div className="card-face w-full h-full flex flex-col bg-white">
      {/* Avatar section */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: isMale
            ? 'linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)'
            : 'linear-gradient(160deg, #FFF1F2 0%, #FFE4E6 100%)',
        }}
      >
        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="bg-white/70 backdrop-blur-sm text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {isMale ? '♂' : '♀'} {formatNumber(profile.number)}
          </span>
        </div>

        {/* Avatar */}
        <div
          className="rounded-full overflow-hidden shadow-xl ring-4 ring-white"
          style={{ width: 120, height: 120 }}
        >
          <Image
            src={avatarUrl}
            alt={`${profile.gender} ${profile.number}번`}
            width={120}
            height={120}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Gender label */}
        <div className="mt-4 text-center px-4">
          <p className="font-serif text-gray-800 font-bold text-lg leading-tight">
            {profile.gender} {formatNumber(profile.number)}번
          </p>
          <p className="text-gray-500 text-sm mt-1">{age}세 · {profile.birthYear}년생</p>
        </div>
      </div>

      {/* Info section */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-3">
          <InfoChip icon="📍" label={profile.location} />
          <InfoChip icon="📏" label={`${profile.height}cm`} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getMbtiColors(profile.mbti)}`}>
            {profile.mbti}
          </span>
          <span className="text-gray-300 text-xs">›</span>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{icon}</span>
      <span className="text-gray-600 text-sm font-medium">{label}</span>
    </div>
  );
}
