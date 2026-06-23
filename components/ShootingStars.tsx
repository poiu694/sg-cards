'use client';
import { useState, useCallback } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  length: number;
  duration: number;
  animKey: number;
}

function randomStar(id: number): Star {
  return {
    id,
    top: Math.random() * 75,
    left: Math.random() * 110 - 5,
    length: Math.random() * 90 + 40,
    duration: Math.random() * 2.5 + 1.5,
    animKey: Math.random(),
  };
}

const INITIAL: Star[] = Array.from({ length: 14 }, (_, i) => ({
  ...randomStar(i),
  // spread out initial delays by staggering animKey so not all fire at once
  animKey: i * 0.07,
}));

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>(INITIAL);

  const respawn = useCallback((id: number) => {
    setStars(prev => prev.map(s => s.id === id ? randomStar(id) : s));
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none', overflow: 'hidden',
      zIndex: 1,
    }}>
      {stars.map(s => (
        <div
          key={`${s.id}-${s.animKey}`}
          onAnimationEnd={() => respawn(s.id)}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.length}px`,
            height: '1.5px',
            borderRadius: '999px',
            background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.55) 55%, rgba(201,168,76,0.4) 100%)',
            animation: `shootingStar ${s.duration}s linear 1 forwards`,
          }}
        />
      ))}
    </div>
  );
}
