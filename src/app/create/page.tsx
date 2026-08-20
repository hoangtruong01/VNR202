// ============================================================
// Create Room Page — Host creates a new game room
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/services/roomService';
import { showToast } from '@/components/ui/Toast';
import GameHeader from '@/components/layout/GameHeader';
import QRCode from 'react-qr-code';

export default function CreateRoomPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!hostName.trim()) {
      showToast('Vui lòng nhập tên người tổ chức', 'error');
      return;
    }
    if (!roomName.trim()) {
      showToast('Vui lòng nhập tên phòng', 'error');
      return;
    }

    setLoading(true);
    try {
      const code = await createRoom(hostName.trim(), roomName.trim());
      setRoomCode(code);
      showToast('Tạo phòng thành công!', 'success');
    } catch (err) {
      console.error('Create room error:', err);
      const error = err as Error;
      if (error?.message === 'FIREBASE_NOT_CONFIGURED') {
        showToast('⚠️ Chưa cấu hình Firebase! Vui lòng cập nhật API Key vào file .env.local', 'error');
      } else {
        showToast('Không thể tạo phòng. Vui lòng kiểm tra lại cấu hình Firebase.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      showToast('Đã sao chép mã phòng!', 'success');
    }
  };

  const handleGoToLobby = () => {
    if (roomCode) {
      router.push(`/room/${roomCode}/admin`);
    }
  };

  const joinUrl =
    typeof window !== 'undefined' && roomCode
      ? `${window.location.origin}/join?code=${roomCode}`
      : '';

  return (
    <div className="container-game fade-in" style={{ paddingTop: 20 }}>
      <GameHeader />

      <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 20 }}>
        {!roomCode ? (
          /* ---- CREATE FORM ---- */
          <div className="card-elevated slide-up" style={{ padding: 28 }}>
            <h2
              className="text-heading"
              style={{
                fontSize: '1.3rem',
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              🎯 Tạo Phòng Mới
            </h2>

            {/* Host name */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="host-name"
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--ink)',
                }}
              >
                Tên người tổ chức
              </label>
              <input
                id="host-name"
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Nhập tên của bạn"
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid rgba(196, 151, 47, 0.5)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  background: '#FFFFFF',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(196, 151, 47, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(196, 151, 47, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            {/* Room name */}
            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="room-name"
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--ink)',
                }}
              >
                Tên phòng
              </label>
              <input
                id="room-name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="VD: Phòng thi lịch sử"
                maxLength={30}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid rgba(196, 151, 47, 0.5)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  background: '#FFFFFF',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(196, 151, 47, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(196, 151, 47, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handleCreate}
              disabled={loading}
              style={{ width: '100%' }}
              id="btn-create"
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Đang tạo...
                </>
              ) : (
                '🏯 TẠO PHÒNG'
              )}
            </button>
          </div>
        ) : (
          /* ---- ROOM CODE DISPLAY ---- */
          <div className="card-elevated slide-up" style={{ padding: 28, textAlign: 'center' }}>
            <h2
              className="text-heading"
              style={{ fontSize: '1.2rem', marginBottom: 8 }}
            >
              ✅ Phòng đã được tạo!
            </h2>

            <p
              style={{
                color: 'var(--ink-muted)',
                fontSize: '0.9rem',
                marginBottom: 20,
              }}
            >
              Chia sẻ mã này cho người chơi
            </p>

            {/* Room Code Display */}
            <div
              className="card-gold"
              style={{
                padding: '20px 24px',
                marginBottom: 20,
              }}
            >
              <h3
                className="text-heading"
                style={{
                  fontSize: '2.5rem',
                  letterSpacing: '0.15em',
                  color: 'var(--ink)',
                }}
              >
                {roomCode}
              </h3>
            </div>

            {/* Copy button */}
            <button
              className="btn btn-outline"
              onClick={handleCopyCode}
              style={{ marginBottom: 16, width: '100%' }}
              id="btn-copy-code"
            >
              📋 COPY MÃ PHÒNG
            </button>

            {/* QR Code */}
            {joinUrl && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--ink-muted)',
                    marginBottom: 10,
                  }}
                >
                  Hoặc quét QR để tham gia
                </p>
                <div className="qr-container">
                  <QRCode
                    value={joinUrl}
                    size={160}
                    bgColor="#FFFFFF"
                    fgColor="#2C1810"
                    level="M"
                  />
                </div>
              </div>
            )}

            {/* Go to lobby */}
            <button
              className="btn btn-primary btn-large"
              onClick={handleGoToLobby}
              style={{ width: '100%' }}
              id="btn-go-lobby"
            >
              🎮 VÀO PHÒNG CHỜ
            </button>
          </div>
        )}

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
