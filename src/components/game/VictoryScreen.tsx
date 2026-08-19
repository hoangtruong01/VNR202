// ============================================================
// VictoryScreen — Final results with confetti
// ============================================================
'use client';

import { useEffect } from 'react';
import { PlayerWithId } from '@/types/game';
import { formatScore, getRankEmoji } from '@/utils/formatters';
import confetti from 'canvas-confetti';

interface VictoryScreenProps {
  players: PlayerWithId[];
  currentPlayerId?: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function VictoryScreen({
  players,
  currentPlayerId,
  onPlayAgain,
  onGoHome,
}: VictoryScreenProps) {
  // Fire confetti on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#C4972F', '#8B1A1A', '#E8D5A3', '#FFD700'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#C4972F', '#8B1A1A', '#E8D5A3', '#FFD700'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  const medalClasses = ['medal-gold', 'medal-silver', 'medal-bronze'];

  return (
    <div className="container-game fade-in" style={{ textAlign: 'center', paddingTop: 32 }}>
      {/* Title */}
      <h1 className="text-heading" style={{ fontSize: '1.6rem', marginBottom: 24 }}>
        🏆 KẾT QUẢ CHUNG CUỘC
      </h1>

      {/* Winner */}
      {top3.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          {/* Crown animation for #1 */}
          <div className="victory-crown">👑</div>

          <h2
            className="text-heading"
            style={{
              fontSize: '1.8rem',
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            {top3[0].name}
          </h2>

          <div className="victory-score">{formatScore(top3[0].score)}</div>
          <p style={{ color: 'var(--gold-dark)', fontWeight: 600, marginTop: 4 }}>
            ĐIỂM
          </p>
        </div>
      )}

      {/* Top 3 medals */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        {top3.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          return (
            <div
              key={player.id}
              className="stagger-item"
              style={{
                animationDelay: `${(index + 1) * 300}ms`,
                textAlign: 'center',
                padding: 16,
                minWidth: 120,
              }}
            >
              <div
                className={`victory-medal ${medalClasses[index]}`}
                style={{ animationDelay: `${(index + 1) * 400}ms` }}
              >
                {getRankEmoji(index + 1)}
              </div>
              <h3
                style={{
                  marginTop: 10,
                  fontSize: '1rem',
                  fontWeight: isCurrentPlayer ? 800 : 600,
                }}
              >
                {player.name}
                {isCurrentPlayer && ' ⭐'}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--gold-dark)',
                }}
              >
                {formatScore(player.score)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Remaining players */}
      {rest.length > 0 && (
        <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
          {rest.map((player, index) => {
            const rank = index + 4;
            const isCurrentPlayer = player.id === currentPlayerId;
            return (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom:
                    index < rest.length - 1
                      ? '1px solid rgba(196, 151, 47, 0.15)'
                      : 'none',
                  fontWeight: isCurrentPlayer ? 700 : 400,
                }}
              >
                <span style={{ minWidth: 28, fontWeight: 600 }}>{rank}.</span>
                <span style={{ flex: 1 }}>
                  {player.name}
                  {isCurrentPlayer && ' ⭐'}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {formatScore(player.score)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Message */}
      <p
        className="text-accent"
        style={{
          marginBottom: 24,
          fontSize: '1rem',
        }}
      >
        &ldquo;Chúc mừng bạn đã hoàn thành Đấu Trường Lịch Sử!&rdquo;
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexDirection: 'column', maxWidth: 320, margin: '0 auto' }}>
        <button className="btn btn-primary btn-large" onClick={onPlayAgain}>
          🔄 CHƠI LẠI
        </button>
        <button className="btn btn-outline" onClick={onGoHome}>
          🏠 VỀ TRANG CHỦ
        </button>
      </div>
    </div>
  );
}
