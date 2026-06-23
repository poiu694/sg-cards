'use client';
import { Profile } from '@/lib/types';
import { getKoreanAge, getJobIcon, formatNumber } from '@/lib/utils';
import HeartButton from './HeartButton';

interface CardBackProps {
  profile: Profile;
}

export default function CardBack({ profile }: CardBackProps) {
  const age = getKoreanAge(profile.birthYear);

  return (
    <div className="card-face card-face-back w-full h-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1A1F3A 0%, #111827 100%)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-serif font-bold text-lg">
              {profile.gender} {formatNumber(profile.number)}번
            </p>
            <p className="text-white/50 text-sm mt-0.5">{age}세 · {profile.location}</p>
          </div>
          <span className="text-2xl">{profile.gender === '남성' ? '🎸' : '🌸'}</span>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/10" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 no-scrollbar">

        {/* Personality */}
        <div>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">성격</p>
          <div className="flex flex-wrap gap-2">
            {profile.personality.split(/[,，、\s]+/).filter(Boolean).map((tag, i) => (
              <span key={i} className="bg-white/10 text-white text-sm px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Job */}
        <div>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">직업</p>
          <div className="flex items-center gap-3 bg-white/8 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="text-2xl">{getJobIcon(profile.jobCategory)}</span>
            <div>
              <p className="text-white font-semibold">{profile.job}</p>
              <p className="text-white/40 text-xs">{profile.jobCategory}</p>
            </div>
          </div>
        </div>

        {/* Preferred partner */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(201,168,76,0.12)' }}>
          <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">원하는 상대 💕</p>
          {profile.preferredJob && profile.preferredJob !== '상관없음' && (
            <p className="text-white/60 text-xs mb-1.5">직업 · {profile.preferredJob}</p>
          )}
          <p className="text-white text-sm leading-relaxed">{profile.preferredPersonality}</p>
        </div>

        {/* Matchmaker */}
        {profile.matchmakerNote && (
          <div className="flex gap-3 items-start">
            <div className="w-0.5 self-stretch bg-gold/40 rounded-full shrink-0" />
            <div>
              <p className="text-white/30 text-xs mb-1">주선자 한마디</p>
              <p className="text-white/80 text-sm italic leading-relaxed">
                &ldquo;{profile.matchmakerNote}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mx-5 h-px bg-white/10" />
      <div className="px-5 py-3 flex items-center justify-between safe-bottom">
        <p className="text-white/30 text-xs">← 탭하여 돌아가기</p>
        <HeartButton profileId={profile.id} size="lg" />
      </div>
    </div>
  );
}
