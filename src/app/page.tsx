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
          fontSize: '3.5rem',
          marginBottom: 8,
          filter: 'drop-shadow(0 4px 8px rgba(196, 151, 47, 0.3))',
        }}
      >
        🏯
      </div>

      {/* Logo */}
      <h1
        className="text-heading-gold"
        style={{
          fontSize: 'clamp(1.8rem, 7vw, 2.5rem)',
          marginBottom: 8,
          letterSpacing: '0.02em',
        }}
      >
        ĐẤU TRƯỜNG LỊCH SỬ
      </h1>

      {/* Subtitle */}
      <p
        className="text-accent"
        style={{
          fontSize: 'clamp(1rem, 3.5vw, 1.15rem)',
          marginBottom: 40,
          maxWidth: 360,
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
          maxWidth: 320,
          marginBottom: 40,
        }}
      >
        <button
          className="btn btn-primary btn-large"
          onClick={() => router.push('/create')}
          id="btn-create-room"
          style={{ fontSize: '1.1rem' }}
        >
          🎯 TẠO PHÒNG
        </button>

        <button
          className="btn btn-secondary btn-large"
          onClick={() => router.push('/join')}
          id="btn-join-room"
          style={{ fontSize: '1.1rem' }}
        >
          🚪 THAM GIA PHÒNG
        </button>
      </div>

      {/* Info badges */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <span className="badge badge-gold">📝 15 câu hỏi</span>
        <span className="badge badge-gold">⚡ Realtime</span>
        <span className="badge badge-gold">👥 Multiplayer</span>
      </div>

      {/* Decorative divider */}
      <div
        style={{
          width: 120,
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          marginBottom: 20,
        }}
      />

      {/* Historical stamp */}
      <div className="seal-stamp" style={{ fontSize: '0.7rem', padding: '6px 16px' }}>
        LỊCH SỬ VIỆT NAM
      </div>
    </div>
  );
}
