// ============================================================
// Home Page — Landing page for Đấu Trường Lịch Sử
// ============================================================
'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="container-game fade-in"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px 16px',
      }}
    >
      {/* Decorative top element */}
      <div
        style={{
          fontSize: 'clamp(3rem, 10vw, 4rem)',
          marginBottom: 12,
          filter: 'drop-shadow(0 6px 12px rgba(196, 151, 47, 0.4))',
        }}
      >
        🏯
      </div>

      {/* Logo */}
      <h1
        className="text-heading-gold"
        style={{
          fontSize: 'clamp(1.8rem, 8vw, 2.6rem)',
          marginBottom: 10,
          letterSpacing: '0.03em',
        }}
      >
        ĐẤU TRƯỜNG LỊCH SỬ
      </h1>

      {/* Subtitle */}
      <p
        className="text-accent"
        style={{
          fontSize: 'clamp(1.05rem, 4vw, 1.2rem)',
          marginBottom: 36,
          maxWidth: 380,
          lineHeight: 1.5,
        }}
      >
        &ldquo;Bạn hiểu lịch sử Việt Nam đến đâu?&rdquo;
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          width: '100%',
          maxWidth: 340,
          marginBottom: 36,
        }}
      >
        <button
          className="btn btn-primary btn-large"
          onClick={() => router.push('/create')}
          id="btn-create-room"
          style={{ fontSize: '1.1rem', width: '100%' }}
        >
          🎯 TẠO PHÒNG
        </button>

        <button
          className="btn btn-secondary btn-large"
          onClick={() => router.push('/join')}
          id="btn-join-room"
          style={{ fontSize: '1.1rem', width: '100%' }}
        >
          🚪 THAM GIA PHÒNG
        </button>
      </div>

      {/* Info badges */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>📝 15 câu hỏi</span>
        <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>⚡ Realtime</span>
        <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>👥 Multiplayer</span>
      </div>

      {/* Decorative divider */}
      <div
        style={{
          width: 120,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
          marginBottom: 20,
          boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
        }}
      />

      {/* Historical stamp */}
      <div className="seal-stamp" style={{ fontSize: '0.7rem', padding: '6px 16px' }}>
        LỊCH SỬ VIỆT NAM
      </div>
    </div>
  );
}
