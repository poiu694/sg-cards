'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Profile } from '@/lib/types';
import CardFront from './CardFront';
import CardBack from './CardBack';

interface ProfileCardProps {
  profile: Profile;
  index?: number;
}

export default function ProfileCard({ profile, index = 0 }: ProfileCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="animate-fade-up w-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="card-scene w-full cursor-pointer select-none"
        style={{ aspectRatio: '3/4' }}
        onClick={() => setFlipped(f => !f)}
        role="button"
        aria-label={`${profile.gender} ${profile.number}번 카드 ${flipped ? '앞면' : '상세'} 보기`}
      >
        <div
          className={`card-inner w-full h-full shadow-lg rounded-3xl ${flipped ? 'flipped' : ''}`}
        >
          <CardFront profile={profile} />
          <CardBack profile={profile} />
        </div>
      </div>
    </motion.div>
  );
}
