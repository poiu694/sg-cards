'use client';
import Image from 'next/image';
import { Profile } from '@/lib/types';
import { getAvatarUrl, getKoreanAge } from '@/lib/utils';

interface TodayPickProps {
  profiles: Profile[];
}

export default function TodayPick({ profiles }: TodayPickProps) {
  if (!profiles.length) return null;

  return (
    <section className="px-4 py-4 bg-navy">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gold text-xs font-bold tracking-widest uppercase">Today&apos;s Pick</span>
        <div className="flex-1 h-px bg-gold/30" />
        <span className="text-gold text-sm">⭐</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {profiles.map(profile => (
          <TodayPickCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function TodayPickCard({ profile }: { profile: Profile }) {
  const avatarUrl = profile.photoUrl || getAvatarUrl(profile.id, profile.gender);
  const age = getKoreanAge(profile.birthYear);

  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2 w-20">
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gold ring-offset-2 ring-offset-navy">
          <Image
            src={avatarUrl}
            alt={`${profile.gender} ${profile.number}번`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <span className="absolute -bottom-1 -right-1 bg-gold text-navy text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {profile.number}
        </span>
      </div>
      <div className="text-center">
        <p className="text-white/80 text-xs">{profile.gender === '남성' ? '남성' : '여성'}</p>
        <p className="text-white/50 text-[10px]">{age}세 · {profile.location}</p>
      </div>
    </div>
  );
}
