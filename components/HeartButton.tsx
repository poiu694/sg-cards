'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartButtonProps {
  profileId: string;
  size?: 'sm' | 'lg';
  onToggle?: (liked: boolean) => void;
}

export default function HeartButton({ profileId, size = 'lg', onToggle }: HeartButtonProps) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem('sg-hearts') || '[]');
    setLiked(saved.includes(profileId));
  }, [profileId]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saved: string[] = JSON.parse(localStorage.getItem('sg-hearts') || '[]');
    let updated: string[];
    if (liked) {
      updated = saved.filter(id => id !== profileId);
    } else {
      updated = [...saved, profileId];
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }
    localStorage.setItem('sg-hearts', JSON.stringify(updated));
    setLiked(!liked);
    onToggle?.(!liked);
  };

  const iconSize = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <button
      onClick={toggle}
      className={`relative flex items-center justify-center tap-target ${size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'}`}
      aria-label={liked ? '찜 취소' : '찜하기'}
    >
      <AnimatePresence>
        {burst && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-sm pointer-events-none"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos((i * 60 * Math.PI) / 180) * 28,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 28,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                ❤️
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
      <motion.span
        animate={liked ? { scale: [1, 1.5, 1] } : { scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={iconSize}
      >
        {liked ? '❤️' : '🤍'}
      </motion.span>
    </button>
  );
}
