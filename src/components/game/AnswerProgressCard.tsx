// ============================================================
// AnswerProgressCard — Displays live player answer progress
// ============================================================
'use client';

interface AnswerProgressCardProps {
  answeredCount: number;
  totalPlayers: number;
  isAllAnswered?: boolean;
}

export default function AnswerProgressCard({
  answeredCount,
  totalPlayers,
  isAllAnswered = false,
}: AnswerProgressCardProps) {
  const percentage =
    totalPlayers > 0 ? Math.min(100, Math.round((answeredCount / totalPlayers) * 100)) : 0;

  return (
    <div
      className="card-elevated fade-in"
      style={{
        marginTop: 14,
        marginBottom: 14,
        padding: '14px 18px',
        border: '1.5px solid var(--gold)',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF9E6 100%)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color: 'var(--ink)',
            }}
          >
            Tiến độ trả lời
          </span>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 12px',
            borderRadius: 999,
            background: isAllAnswered
              ? 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
              : 'linear-gradient(135deg, #120905 0%, #3D2314 100%)',
            color: '#FFFDF9',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          {answeredCount} / {totalPlayers} người
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: 10,
          background: 'rgba(196, 151, 47, 0.2)',
          borderRadius: 6,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: isAllAnswered
              ? 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)'
              : 'linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%)',
            borderRadius: 6,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Message */}
      <div
        style={{
          marginTop: 8,
          textAlign: 'center',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: isAllAnswered ? '#1B5E20' : 'var(--ink-muted)',
        }}
      >
        {isAllAnswered ? (
          <span className="fade-in">⚡ Tất cả người chơi đã chọn xong! Đang chuyển đáp án...</span>
        ) : (
          <span>
            {totalPlayers - answeredCount > 0
              ? `Còn ${totalPlayers - answeredCount} người chưa đưa ra lựa chọn`
              : 'Đang chờ người chơi chọn đáp án...'}
          </span>
        )}
      </div>
    </div>
  );
}
