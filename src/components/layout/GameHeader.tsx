// ============================================================
// GameHeader — Shared header for game/admin screens
// ============================================================

interface GameHeaderProps {
  roomCode?: string;
  subtitle?: string;
}

export default function GameHeader({ roomCode, subtitle }: GameHeaderProps) {
  return (
    <header style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 12 }}>
      <h1
        className="text-heading-gold"
        style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}
      >
        🏯 ĐẤU TRƯỜNG LỊCH SỬ
      </h1>
      {roomCode && (
        <div className="seal-stamp" style={{ marginTop: 8, fontSize: '0.75rem' }}>
          PHÒNG: {roomCode}
        </div>
      )}
      {subtitle && (
        <p style={{ marginTop: 6, color: 'var(--ink-muted)', fontSize: '0.85rem' }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
