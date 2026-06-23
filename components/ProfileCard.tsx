'use client';
import { motion } from 'framer-motion';
import { Profile } from '@/lib/types';
import { getKoreanAge, formatNumber } from '@/lib/utils';
import HeartButton from './HeartButton';

interface ProfileCardProps {
  profile: Profile;
  index?: number;
}

export default function ProfileCard({ profile, index = 0 }: ProfileCardProps) {
  const age = getKoreanAge(profile.birthYear);
  const isMale = profile.gender === '남성';

  return (
    <motion.div
      className="animate-fade-up w-full"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1C2040 0%, #131828 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: isMale ? 'rgba(96,130,251,0.2)' : 'rgba(251,96,130,0.2)' }}
            >
              {isMale ? '🧑' : '👩'}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: isMale ? 'rgba(96,130,251,0.25)' : 'rgba(251,96,130,0.25)',
                  color: isMale ? '#93A8FC' : '#FC93A8',
                }}
              >
                {profile.gender}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/50">
                #{formatNumber(profile.number)}번
              </span>
            </div>
          </div>
          <h2 className="text-white font-bold text-2xl leading-snug">
            {profile.birthYear}년생 · {age}세
          </h2>
        </div>

        <div className="h-px mx-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Info grid */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <InfoBox label="MBTI" value={profile.mbti} />
            <InfoBox label="키" value={`${profile.height}cm`} />
            <InfoBox label="거주지" value={profile.location} />
            <InfoBox label="직업" value={profile.job} />
          </div>
          <InfoBox label="성격" value={profile.personality} />
        </div>

        {/* 원하는 상대 */}
        {(profile.preferredPersonality || (profile.preferredJob && profile.preferredJob !== '상관없음')) && (
        <div className="mx-5 mb-3 rounded-2xl p-4" style={{ background: 'rgba(251,96,130,0.08)', border: '1px solid rgba(251,96,130,0.12)' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#FC93A8' }}>♡ 원하는 상대</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {profile.preferredJob && profile.preferredJob !== '상관없음' && `직업 ${profile.preferredJob}, `}
            {profile.preferredPersonality}
          </p>
        </div>
        )}

        {/* 주선자 한마디 */}
        {profile.matchmakerNote && (
          <div className="mx-5 mb-4 rounded-2xl p-4" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#C9A84C' }}>✦ 주선자 한마디</p>
            <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              &ldquo;{profile.matchmakerNote}&rdquo;
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-end">
          <HeartButton profileId={profile.id} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  if (!value || value === '미기재') return null;
  return (
    <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <p className="text-xs mb-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
