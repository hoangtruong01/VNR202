// ============================================================
// Admin Dashboard — Host control room with live game management
// ============================================================
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { usePlayers } from '@/hooks/usePlayers';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import {
  startGame,
  nextQuestion,
  showAnswer,
  showLeaderboard,
  pauseGame,
  resumeGame,
  endGame,
  restartGame,
} from '@/services/gameService';
import { auth } from '@/lib/firebase';
import questions from '@/data/questions';
import { SCORING, GameStatus } from '@/types/game';
import GameHeader from '@/components/layout/GameHeader';
import Leaderboard from '@/components/game/Leaderboard';
import VictoryScreen from '@/components/game/VictoryScreen';
import Timer from '@/components/ui/Timer';
import ProgressBar from '@/components/ui/ProgressBar';
import SoundToggle from '@/components/ui/SoundToggle';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { showToast } from '@/components/ui/Toast';
import { formatScore, truncateName } from '@/utils/formatters';

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const { room, loading, error } = useRoom(roomCode);
  const { players, playerCount } = usePlayers(roomCode);
  const { leaderboard, leader, leaderChanged } = useLeaderboard(players);
  const { play, soundEnabled, toggleSound } = useSound();

  const [isProcessing, setIsProcessing] = useState(false);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = auth?.currentUser?.uid;
  const isHost = room?.hostId === currentUserId;

  // Timer for current question
  const { timeLeft, progress, isUrgent } = useTimer(
    room?.questionStartedAt || null,
    room?.status === 'playing',
    // Auto-show answer when timer expires
    () => {
      if (room?.status === 'playing') {
        handleShowAnswer();
      }
    }
  );

  // Auto-advance: answer → leaderboard → next question
  useEffect(() => {
    if (!room || !isHost) return;

    if (room.status === 'showing_answer') {
      autoAdvanceTimerRef.current = setTimeout(() => {
        handleShowLeaderboard();
      }, SCORING.ANSWER_REVEAL_TIME);
    }

    if (room.status === 'showing_leaderboard') {
      autoAdvanceTimerRef.current = setTimeout(() => {
        handleNextQuestion();
      }, SCORING.LEADERBOARD_REVEAL_TIME);
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status, isHost]);

  // Leader change alert
  useEffect(() => {
    if (leaderChanged && leader) {
      play('correct');
    }
  }, [leaderChanged, leader, play]);

  const handleAction = useCallback(
    async (action: () => Promise<void>, successMsg?: string) => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        await action();
        if (successMsg) showToast(successMsg, 'success');
      } catch (err) {
        console.error('Admin action error:', err);
        showToast('Có lỗi xảy ra', 'error');
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  const handleStartGame = () =>
    handleAction(() => startGame(roomCode), '🎮 Game bắt đầu!');

  const handleShowAnswer = () =>
    handleAction(() => showAnswer(roomCode));

  const handleShowLeaderboard = () =>
    handleAction(() => showLeaderboard(roomCode));

  const handleNextQuestion = () => {
    if (!room) return;
    handleAction(() => nextQuestion(roomCode, room.currentQuestion));
  };

  const handlePause = () =>
    handleAction(() => pauseGame(roomCode), '⏸️ Đã tạm dừng');

  const handleResume = () =>
    handleAction(() => resumeGame(roomCode), '▶️ Tiếp tục!');

  const handleEnd = () =>
    handleAction(() => endGame(roomCode), '🏁 Kết thúc game!');

  const handleRestart = () =>
    handleAction(() => restartGame(roomCode), '🔄 Đã reset!');

  // Loading
  if (loading) return <LoadingSpinner text="Đang kết nối..." />;

  // Error / not host
  if (error || !room) {
    return (
      <div className="container-admin" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2 className="text-heading" style={{ marginBottom: 16 }}>
          ❌ Phòng không tồn tại
        </h2>
        <button className="btn btn-primary" onClick={() => router.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  if (!isHost) {
    return (
      <div className="container-admin" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2 className="text-heading" style={{ marginBottom: 16 }}>
          🔒 Chỉ Host mới được truy cập
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => router.push(`/room/${roomCode}/play`)}
        >
          Vào game
        </button>
      </div>
    );
  }

  // FINISHED — Show victory
  if (room.status === 'finished') {
    return (
      <div>
        <VictoryScreen
          players={players}
          onPlayAgain={() => handleRestart()}
          onGoHome={() => router.push('/')}
        />
        <div className="container-admin" style={{ paddingTop: 20 }}>
          {/* Full final leaderboard */}
          <div className="card-elevated" style={{ padding: 20 }}>
            <Leaderboard
              players={players}
              title="📊 BẢNG XẾP HẠNG ĐẦYĐỦ"
              showAnimation={false}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[room.currentQuestion];
  const statusLabels: Record<GameStatus, string> = {
    waiting: '⏳ Chờ bắt đầu',
    playing: '🟢 ĐANG CHƠI',
    paused: '⏸️ TẠM DỪNG',
    showing_answer: '📝 HIỂN THỊ ĐÁP ÁN',
    showing_leaderboard: '🏆 XẾP HẠNG',
    finished: '🏁 KẾT THÚC',
  };

  // Count answered players
  const answeredCount = players.filter((p) => p.currentAnswer !== -1).length;

  return (
    <div className="container-admin fade-in" style={{ paddingTop: 12, paddingBottom: 32 }}>
      <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 className="text-heading-gold" style={{ fontSize: '1.3rem' }}>
          🎮 CONTROL ROOM
        </h1>
        <div className="seal-stamp" style={{ marginTop: 6, fontSize: '0.7rem' }}>
          PHÒNG: {roomCode}
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 4, letterSpacing: '0.05em' }}>
            TRẠNG THÁI
          </p>
          <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--ink)' }}>
            {statusLabels[room.status]}
          </p>
        </div>
        <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 4, letterSpacing: '0.05em' }}>
            NGƯỜI CHƠI
          </p>
          <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)' }}>{playerCount}</p>
        </div>
        <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 4, letterSpacing: '0.05em' }}>
            CÂU HỎI
          </p>
          <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)' }}>
            {room.status === 'waiting'
              ? '—'
              : `${room.currentQuestion + 1} / ${SCORING.TOTAL_QUESTIONS}`}
          </p>
        </div>
        <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 4, letterSpacing: '0.05em' }}>
            THỜI GIAN
          </p>
          <p
            style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: isUrgent ? 'var(--crimson)' : 'var(--ink)',
            }}
          >
            {room.status === 'playing' ? `${timeLeft}s` : '—'}
          </p>
        </div>
      </div>

      {/* Timer + Progress (during game) */}
      {room.status !== 'waiting' && (
        <div style={{ marginBottom: 16 }}>
          <ProgressBar
            current={room.currentQuestion}
            total={SCORING.TOTAL_QUESTIONS}
            urgent={isUrgent}
          />
        </div>
      )}

      {/* Current question preview (playing/showing) */}
      {room.status !== 'waiting' && currentQuestion && (
        <div className="card-elevated" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            {room.status === 'playing' && (
              <Timer timeLeft={timeLeft} progress={progress} isUrgent={isUrgent} />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: 4 }}>
                CÂU {room.currentQuestion + 1}
              </p>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4 }}>
                {currentQuestion.question}
              </p>
            </div>
          </div>

          {/* Answered count */}
          {room.status === 'playing' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'rgba(196, 151, 47, 0.08)',
                borderRadius: 'var(--radius-sm)',
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>
                ✅ {answeredCount}/{playerCount} đã trả lời
              </span>
              {answeredCount === playerCount && playerCount > 0 && (
                <span className="badge badge-gold" style={{ marginLeft: 'auto' }}>
                  Tất cả đã trả lời!
                </span>
              )}
            </div>
          )}

          {/* Show correct answer during answer reveal */}
          {room.status === 'showing_answer' && (
            <div
              style={{
                marginTop: 8,
                padding: '10px 14px',
                background: 'rgba(27, 94, 32, 0.08)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--jade)',
              }}
            >
              <p style={{ fontSize: '0.8rem', color: 'var(--jade)', fontWeight: 600, marginBottom: 4 }}>
                ĐÁP ÁN ĐÚNG
              </p>
              <p style={{ fontWeight: 600 }}>
                {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{' '}
                {currentQuestion.answers[currentQuestion.correctAnswer]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Leader Highlight */}
      {room.status !== 'waiting' && leader && (
        <div
          className={`leader-highlight ${leaderChanged ? 'leader-change-animation' : ''}`}
          style={{ marginBottom: 16 }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: 4 }}>
              👑 ĐANG DẪN ĐẦU
            </p>
            <h2
              className="text-heading"
              style={{ fontSize: '1.5rem', marginBottom: 4 }}
            >
              {leader.name}
            </h2>
            <p
              className="victory-score"
              style={{ fontSize: '1.8rem' }}
            >
              {formatScore(leader.score)}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
              🥇 Hạng 1
            </p>
            {leaderChanged && (
              <p
                className="scale-in"
                style={{
                  marginTop: 8,
                  fontSize: '0.85rem',
                  color: 'var(--crimson)',
                  fontWeight: 700,
                }}
              >
                🔥 {leader.name.toUpperCase()} VỪA VƯƠN LÊN HẠNG 1!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="card-elevated" style={{ padding: 16, marginBottom: 16 }}>
        <h3
          className="text-heading"
          style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--gold-dark)' }}
        >
          🎮 ĐIỀU KHIỂN
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {/* WAITING: Start */}
          {room.status === 'waiting' && (
            <button
              className="btn btn-primary"
              onClick={handleStartGame}
              disabled={playerCount === 0 || isProcessing}
              style={{ flex: 1, minWidth: 140 }}
              id="btn-start-game"
            >
              🚀 BẮT ĐẦU GAME
            </button>
          )}

          {/* PLAYING: Show Answer / Pause */}
          {room.status === 'playing' && (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleShowAnswer}
                disabled={isProcessing}
                style={{ flex: 1, minWidth: 130 }}
              >
                📝 HIỆN ĐÁP ÁN
              </button>
              <button
                className="btn btn-outline"
                onClick={handlePause}
                disabled={isProcessing}
                style={{ flex: 1, minWidth: 100 }}
              >
                ⏸️ TẠM DỪNG
              </button>
            </>
          )}

          {/* PAUSED: Resume */}
          {room.status === 'paused' && (
            <button
              className="btn btn-primary"
              onClick={handleResume}
              disabled={isProcessing}
              style={{ flex: 1, minWidth: 140 }}
            >
              ▶️ TIẾP TỤC
            </button>
          )}

          {/* SHOWING_ANSWER: Next → Leaderboard */}
          {room.status === 'showing_answer' && (
            <button
              className="btn btn-secondary"
              onClick={handleShowLeaderboard}
              disabled={isProcessing}
              style={{ flex: 1, minWidth: 160 }}
            >
              🏆 HIỆN XẾP HẠNG
            </button>
          )}

          {/* SHOWING_LEADERBOARD: Next question */}
          {room.status === 'showing_leaderboard' && (
            <button
              className="btn btn-primary"
              onClick={handleNextQuestion}
              disabled={isProcessing}
              style={{ flex: 1, minWidth: 140 }}
            >
              {room.currentQuestion + 1 >= SCORING.TOTAL_QUESTIONS
                ? '🏁 KẾT THÚC'
                : '➡️ CÂU TIẾP THEO'}
            </button>
          )}

          {/* Always show End button during game */}
          {room.status !== 'waiting' && (
            <button
              className="btn btn-ghost"
              onClick={handleEnd}
              disabled={isProcessing}
              style={{
                flex: 0,
                minWidth: 100,
                color: 'var(--crimson)',
                fontSize: '0.85rem',
              }}
            >
              ⏹️ KẾT THÚC
            </button>
          )}

          {/* WAITING: show restart option */}
          {room.status === 'waiting' && (
            <button
              className="btn btn-ghost"
              onClick={() => router.push('/')}
              style={{ flex: 1, minWidth: 100 }}
            >
              🏠 VỀ TRANG CHỦ
            </button>
          )}
        </div>
      </div>

      {/* Player Table */}
      <div className="card-elevated" style={{ padding: 16, overflowX: 'auto' }}>
        <h3
          className="text-heading"
          style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--gold-dark)' }}
        >
          📋 BẢNG NGƯỜI CHƠI
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Người chơi</th>
              <th style={{ textAlign: 'right' }}>Điểm</th>
              <th style={{ textAlign: 'center' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player.id}>
                <td>
                  <span
                    style={{
                      fontWeight: index < 3 ? 700 : 400,
                      fontSize: index < 3 ? '1.1rem' : '0.9rem',
                    }}
                  >
                    {index < 3
                      ? ['🥇', '🥈', '🥉'][index]
                      : index + 1}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 500 }}>
                    {truncateName(player.name)}
                  </span>
                  {player.rankChange === 'up' && (
                    <span style={{ color: 'var(--jade)', marginLeft: 6, fontSize: '0.75rem' }}>
                      ▲
                    </span>
                  )}
                  {player.rankChange === 'down' && (
                    <span style={{ color: 'var(--crimson)', marginLeft: 6, fontSize: '0.75rem' }}>
                      ▼
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {formatScore(player.score)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    className={`status-dot ${
                      player.isOnline
                        ? 'status-dot-online'
                        : 'status-dot-offline'
                    }`}
                  />
                </td>
              </tr>
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: 'center',
                    color: 'var(--ink-muted)',
                    fontStyle: 'italic',
                    padding: 20,
                  }}
                >
                  Chưa có người chơi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
