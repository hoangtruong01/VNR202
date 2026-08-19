// ============================================================
// Lobby Page — Waiting room for players (shared view)
// ============================================================
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { usePlayers } from '@/hooks/usePlayers';
import { useSound } from '@/hooks/useSound';
import GameHeader from '@/components/layout/GameHeader';
import SoundToggle from '@/components/ui/SoundToggle';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { auth } from '@/lib/firebase';
import { setupPresence } from '@/services/presenceService';
import { truncateName } from '@/utils/formatters';

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const { room, loading, error } = useRoom(roomCode);
  const { players, playerCount } = usePlayers(roomCode);
  const { play, soundEnabled, toggleSound } = useSound();

  const currentUserId = auth?.currentUser?.uid;
  const isHost = room?.hostId === currentUserId;

  // Setup presence tracking
  useEffect(() => {
    if (!currentUserId || !roomCode) return;
    const cleanup = setupPresence(roomCode, currentUserId);
    return cleanup;
  }, [currentUserId, roomCode]);

  // Play sound when a new player joins
  useEffect(() => {
    if (playerCount > 0) {
      play('join');
    }
  }, [playerCount, play]);

  // Navigate when game starts
  useEffect(() => {
    if (!room) return;

    if (room.status === 'playing' || room.status === 'showing_answer' || room.status === 'showing_leaderboard') {
      if (isHost) {
        router.push(`/room/${roomCode}/admin`);
      } else {
        router.push(`/room/${roomCode}/play`);
      }
    }

    if (room.status === 'finished') {
      if (isHost) {
        router.push(`/room/${roomCode}/admin`);
      } else {
        router.push(`/room/${roomCode}/play`);
      }
    }
  }, [room?.status, isHost, roomCode, router, room]);

  if (loading) return <LoadingSpinner text="Đang kết nối..." />;

  if (error || !room) {
    return (
      <div className="container-game" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2 className="text-heading" style={{ marginBottom: 16 }}>
          ❌ Phòng không tồn tại
        </h2>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 24 }}>
          Mã phòng không hợp lệ hoặc phòng đã bị xóa.
        </p>
        <button className="btn btn-primary" onClick={() => router.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container-game fade-in" style={{ paddingTop: 12 }}>
      <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />

      <GameHeader roomCode={roomCode} subtitle={room.roomName} />

      <div style={{ maxWidth: 440, margin: '0 auto', paddingTop: 16 }}>
        {/* Status */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
            ⏳ Đang chờ host bắt đầu...
          </span>
        </div>

        {/* Player count */}
        <div
          className="card-gold"
          style={{
            textAlign: 'center',
            padding: '16px 24px',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
            }}
          >
            {playerCount}
          </span>
          <p style={{ color: 'var(--ink-light)', fontSize: '0.9rem' }}>
            người đã tham gia
          </p>
        </div>

        {/* Player list */}
        <div className="card-elevated" style={{ padding: 20 }}>
          <h3
            className="text-heading"
            style={{ fontSize: '1rem', marginBottom: 14 }}
          >
            👥 Danh sách người chơi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {players.map((player, index) => (
              <div
                key={player.id}
                className="stagger-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background:
                    player.id === currentUserId
                      ? 'rgba(196, 151, 47, 0.1)'
                      : 'transparent',
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span
                  style={{
                    flex: 1,
                    fontWeight: player.id === currentUserId ? 700 : 400,
                  }}
                >
                  {truncateName(player.name)}
                  {player.id === currentUserId && (
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
                <span
                  className={`status-dot ${
                    player.isOnline
                      ? 'status-dot-online'
                      : 'status-dot-offline'
                  }`}
                />
                <span
                  style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}
                >
                  {player.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}

            {players.length === 0 && (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--ink-muted)',
                  fontStyle: 'italic',
                  padding: 16,
                }}
              >
                Đang chờ người chơi tham gia...
              </p>
            )}
          </div>
        </div>

        {/* Host: info about admin panel */}
        {isHost && (
          <div
            style={{ textAlign: 'center', marginTop: 20 }}
          >
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
              Bạn là Host. Hãy vào phòng điều khiển để bắt đầu game.
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => router.push(`/room/${roomCode}/admin`)}
              style={{ width: '100%' }}
              id="btn-go-admin"
            >
              🎮 VÀO PHÒNG ĐIỀU KHIỂN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
