'use client';
import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  length: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        top: Math.random() * 70,
        left: Math.random() * 100,
        length: Math.random() * 90 + 50,
        duration: Math.random() * 2.5 + 1.8,
        delay: Math.random() * 12,
        opacity: Math.random() * 0.45 + 0.25,
      }))
    );
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.length}px`,
            height: '1.5px',
            borderRadius: '999px',
            background: `linear-gradient(to right, transparent 0%, rgba(255,255,255,${s.opacity}) 60%, rgba(201,168,76,${s.opacity * 0.6}) 100%)`,
            animation: `shootingStar ${s.duration}s ${s.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
