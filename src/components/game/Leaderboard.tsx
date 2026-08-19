// ============================================================
// Leaderboard — Shows ranked list of players
// ============================================================
'use client';

import { PlayerWithId } from '@/types/game';
import { getRankEmoji, formatScore, truncateName } from '@/utils/formatters';

interface LeaderboardProps {
  players: PlayerWithId[];
  limit?: number;
  title?: string;
  showAnimation?: boolean;
  currentPlayerId?: string;
}

export default function Leaderboard({
  players,
  limit,
  title = '🏆 BẢNG XẾP HẠNG',
  showAnimation = true,
  currentPlayerId,
}: LeaderboardProps) {
  const displayPlayers = limit ? players.slice(0, limit) : players;

  return (
    <div className="scale-in">
      <h3
        className="text-heading"
        style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          marginBottom: 16,
          color: 'var(--gold-dark)',
        }}
      >
        {title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {displayPlayers.map((player, index) => {
          const rank = player.rank || index + 1;
          const isCurrentPlayer = player.id === currentPlayerId;

          let itemClass = 'leaderboard-item';
          if (rank === 1) itemClass += ' leaderboard-item-1';
          else if (rank === 2) itemClass += ' leaderboard-item-2';
          else if (rank === 3) itemClass += ' leaderboard-item-3';

          if (showAnimation) {
            itemClass += ' stagger-item';
          }

          return (
            <div
              key={player.id}
              className={itemClass}
              style={{
                animationDelay: showAnimation ? `${index * 100}ms` : '0ms',
                outline: isCurrentPlayer
                  ? '2px solid var(--gold)'
                  : 'none',
              }}
            >
              {/* Rank */}
              <span
                style={{
                  fontSize: rank <= 3 ? '1.4rem' : '1rem',
                  fontWeight: 700,
                  minWidth: 32,
                  textAlign: 'center',
                }}
              >
                {getRankEmoji(rank)}
              </span>

              {/* Name */}
              <span
                style={{
                  flex: 1,
                  fontWeight: isCurrentPlayer ? 700 : 500,
                  fontSize: rank <= 3 ? '1rem' : '0.9rem',
                }}
              >
                {truncateName(player.name)}
                {isCurrentPlayer && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      marginLeft: 6,
                      color: 'var(--gold-dark)',
                    }}
                  >
                    (Bạn)
                  </span>
                )}
              </span>

              {/* Score */}
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: rank <= 3 ? '1.1rem' : '0.95rem',
                  color:
                    rank === 1
                      ? 'var(--gold-dark)'
                      : 'var(--ink)',
                }}
              >
                {formatScore(player.score)}
              </span>

              {/* Online status */}
              <span
                className={`status-dot ${
                  player.isOnline
                    ? 'status-dot-online'
                    : 'status-dot-offline'
                }`}
              />
            </div>
          );
        })}

        {displayPlayers.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--ink-muted)',
              padding: 20,
              fontStyle: 'italic',
            }}
          >
            Chưa có người chơi
          </p>
        )}
      </div>
    </div>
  );
}
