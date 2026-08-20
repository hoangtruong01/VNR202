// ============================================================
// GameHeader — Shared header for game/admin screens
// ============================================================

interface GameHeaderProps {
  roomCode?: string;
  subtitle?: string;
}

export default function GameHeader({ roomCode, subtitle }: GameHeaderProps) {
  return (
    <header style={{ textAlign: 'center', paddingTop: 12, paddingBottom: 12 }}>
      <h1
        className="text-heading-gold"
        style={{ fontSize: 'clamp(1.3rem, 5vw, 1.6rem)' }}
      >
        🏯 ĐẤU TRƯỜNG LỊCH SỬ
      </h1>
      {roomCode && (
        <div className="seal-stamp" style={{ marginTop: 8, fontSize: '0.75rem' }}>
          PHÒNG: {roomCode}
        </div>
      )}
      {subtitle && (
        <p style={{ marginTop: 6, color: '#120905', fontSize: '0.9rem', fontWeight: 700, textShadow: '0 1px 4px rgba(255,255,255,0.9)' }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
