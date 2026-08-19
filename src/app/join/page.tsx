// ============================================================
// Join Room Page — Player joins an existing room
// ============================================================
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { joinRoom, checkRoom } from '@/services/roomService';
import { showToast } from '@/components/ui/Toast';
import GameHeader from '@/components/layout/GameHeader';

function JoinRoomForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill room code from URL query
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) setRoomCode(code.toUpperCase());
  }, [searchParams]);

  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase();
    const name = playerName.trim();

    if (!code) {
      showToast('Vui lòng nhập mã phòng', 'error');
      return;
    }
    if (!name) {
      showToast('Vui lòng nhập nickname', 'error');
      return;
    }
    if (name.length < 2) {
      showToast('Nickname phải có ít nhất 2 ký tự', 'error');
      return;
    }

    setLoading(true);
    try {
      // Check room first
      const roomCheck = await checkRoom(code);
      if (!roomCheck.exists) {
        showToast('Mã phòng không tồn tại', 'error');
        setLoading(false);
        return;
      }
      if (roomCheck.status === 'finished') {
        showToast('Phòng đã kết thúc', 'error');
        setLoading(false);
        return;
      }

      // Join
      await joinRoom(code, name);
      showToast(`Đã tham gia phòng ${code}!`, 'success');

      // Navigate to lobby
      router.push(`/room/${code}/lobby`);
    } catch (err) {
      const error = err as Error;
      switch (error.message) {
        case 'FIREBASE_NOT_CONFIGURED':
          showToast('⚠️ Chưa cấu hình Firebase! Vui lòng cập nhật API Key vào file .env.local', 'error');
          break;
        case 'ROOM_NOT_FOUND':
          showToast('Mã phòng không tồn tại', 'error');
          break;
        case 'ROOM_FINISHED':
          showToast('Phòng đã kết thúc', 'error');
          break;
        case 'NAME_TAKEN':
          showToast('Nickname đã được sử dụng. Vui lòng chọn tên khác.', 'error');
          break;
        default:
          showToast('Không thể tham gia phòng. Vui lòng thử lại.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-game fade-in" style={{ paddingTop: 20 }}>
      <GameHeader />

      <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 20 }}>
        <div className="card-elevated slide-up" style={{ padding: 28 }}>
          <h2
            className="text-heading"
            style={{
              fontSize: '1.3rem',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            🚪 Tham Gia Phòng
          </h2>

          {/* Room code input */}
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="room-code"
              style={{
                display: 'block',
                marginBottom: 6,
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--ink-light)',
              }}
            >
              Mã phòng
            </label>
            <input
              id="room-code"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="VD: ABC123"
              maxLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--gold-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: '0.1em',
                background: 'var(--white)',
                outline: 'none',
                textTransform: 'uppercase',
                transition: 'border-color var(--transition-normal)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--gold-light)')
              }
            />
          </div>

          {/* Player name input */}
          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="player-name"
              style={{
                display: 'block',
                marginBottom: 6,
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--ink-light)',
              }}
            >
              Nickname
            </label>
            <input
              id="player-name"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nhập nickname của bạn"
              maxLength={15}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--gold-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                background: 'var(--white)',
                outline: 'none',
                transition: 'border-color var(--transition-normal)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--gold-light)')
              }
            />
          </div>

          <button
            className="btn btn-primary btn-large"
            onClick={handleJoin}
            disabled={loading}
            style={{ width: '100%' }}
            id="btn-join"
          >
            {loading ? (
              <>
                <span
                  className="spinner"
                  style={{ width: 20, height: 20, borderWidth: 2 }}
                />
                Đang tham gia...
              </>
            ) : (
              '🏯 THAM GIA'
            )}
          </button>
        </div>

        {/* Back button */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => router.push('/')}>
            ← Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JoinRoomPage() {
  return (
    <Suspense fallback={<div className="container-game" style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}>
      <JoinRoomForm />
    </Suspense>
  );
}
