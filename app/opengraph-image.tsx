import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '시라노 연애조작단';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0D1030 0%, #080B1A 60%, #0D0818 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: -120, left: -120,
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,96,130,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '15%',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,130,251,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Top label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 28,
          letterSpacing: '0.25em',
          fontSize: 15,
          color: 'rgba(201,168,76,0.75)',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          BLIND DATE MATCHING
        </div>

        {/* Main title */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 74,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <span>시라노 연애조작단</span>
            <span style={{ fontSize: 64 }}>💕</span>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 52,
          letterSpacing: '0.02em',
          display: 'flex',
        }}>
          당신의 특별한 인연을 찾아보세요
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 52 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100, padding: '10px 24px',
            color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: 600,
          }}>
            👨 남성 참여 중
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(251,96,130,0.15)',
            border: '1px solid rgba(251,96,130,0.3)',
            borderRadius: 100, padding: '10px 24px',
            color: '#FC93A8', fontSize: 18, fontWeight: 600,
          }}>
            👩 여성 참여 중
          </div>
        </div>

        {/* Bottom domain */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 28px',
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 100,
          color: '#C9A84C',
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}>
          sg-cards.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
