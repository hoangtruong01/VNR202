// ============================================================
// Player Game View — The main game experience for players
// ============================================================
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { usePlayers } from '@/hooks/usePlayers';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { submitAnswer, resetPlayerAnswer } from '@/services/playerService';
import { setupPresence } from '@/services/presenceService';
import { auth } from '@/lib/firebase';
import questions from '@/data/questions';
import { SCORING } from '@/types/game';
import GameHeader from '@/components/layout/GameHeader';
import QuestionCard from '@/components/game/QuestionCard';
import DidYouKnow from '@/components/game/DidYouKnow';
import Leaderboard from '@/components/game/Leaderboard';
import VictoryScreen from '@/components/game/VictoryScreen';
import Timer from '@/components/ui/Timer';
import ProgressBar from '@/components/ui/ProgressBar';
import SoundToggle from '@/components/ui/SoundToggle';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { showToast } from '@/components/ui/Toast';
import { getScoreLabel } from '@/utils/scoring';

export default function PlayerGamePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const { room, loading, error } = useRoom(roomCode);
  const { players } = usePlayers(roomCode);
  const { play, soundEnabled, toggleSound } = useSound();

  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const currentUserId = auth?.currentUser?.uid;
  const prevQuestionRef = useRef<number>(-1);

  // Timer — player-side (for visual feedback only; host controls transitions)
  const { timeLeft, progress, isUrgent } = useTimer(
    room?.questionStartedAt || null,
    room?.status === 'playing'
  );

  // Play tick sound in last 5 seconds
  useEffect(() => {
    if (isUrgent && timeLeft > 0 && room?.status === 'playing') {
      play('tick');
    }
  }, [timeLeft, isUrgent, room?.status, play]);

  // Setup presence
  useEffect(() => {
    if (!currentUserId || !roomCode) return;
    const cleanup = setupPresence(roomCode, currentUserId);
    return cleanup;
  }, [currentUserId, roomCode]);

  // Reset answer state when question changes
  useEffect(() => {
    if (!room) return;
    if (room.currentQuestion !== prevQuestionRef.current) {
      setHasAnswered(false);
      setSelectedAnswer(-1);
      setLastScore(null);
      setLastCorrect(null);
      prevQuestionRef.current = room.currentQuestion;

      // Reset answer in Firebase
      if (currentUserId) {
        resetPlayerAnswer(roomCode, currentUserId).catch(() => {});
      }
    }
  }, [room?.currentQuestion, roomCode, currentUserId, room]);

  // Play correct/wrong sound on answer reveal
  useEffect(() => {
    if (room?.status === 'showing_answer' && lastCorrect !== null) {
      play(lastCorrect ? 'correct' : 'wrong');
    }
  }, [room?.status, lastCorrect, play]);

  // Play victory sound
  useEffect(() => {
    if (room?.status === 'finished') {
      play('victory');
    }
  }, [room?.status, play]);

  const handleAnswer = useCallback(
    async (answerIndex: number) => {
      if (hasAnswered || !currentUserId || !room) return;

      setHasAnswered(true);
      setSelectedAnswer(answerIndex);
      play('click');

      try {
        const result = await submitAnswer(
          roomCode,
          currentUserId,
          room.currentQuestion,
          answerIndex
        );
        setLastScore(result.scoreAwarded);
        setLastCorrect(result.isCorrect);
      } catch (err) {
        const error = err as Error;
        if (error.message === 'ALREADY_ANSWERED') {
          showToast('Bạn đã trả lời câu này rồi', 'info');
        } else {
          showToast('Lỗi khi gửi câu trả lời', 'error');
        }
      }
    },
    [hasAnswered, currentUserId, room, roomCode, play]
  );

  const handlePlayAgain = () => {
    router.push(`/room/${roomCode}/lobby`);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Loading state
  if (loading) return <LoadingSpinner text="Đang kết nối vào game..." />;

  // Error state
  if (error || !room) {
    return (
      <div className="container-game" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2 className="text-heading" style={{ marginBottom: 16 }}>
          ❌ Không tìm thấy phòng
        </h2>
        <button className="btn btn-primary" onClick={() => router.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // Waiting state (shouldn't normally reach here, but handle it)
  if (room.status === 'waiting') {
    return (
      <div className="container-game" style={{ textAlign: 'center', paddingTop: 80 }}>
        <GameHeader roomCode={roomCode} />
        <h2 className="text-heading" style={{ marginTop: 24 }}>
          ⏳ Đang chờ host bắt đầu...
        </h2>
      </div>
    );
  }

  // Paused state
  if (room.status === 'paused') {
    return (
      <div className="container-game" style={{ textAlign: 'center', paddingTop: 80 }}>
        <GameHeader roomCode={roomCode} />
        <div className="card-gold" style={{ marginTop: 24, padding: 32 }}>
          <h2 className="text-heading" style={{ fontSize: '1.5rem', marginBottom: 8 }}>
            ⏸️ Game tạm dừng
          </h2>
          <p style={{ color: 'var(--ink-muted)' }}>
            Host đã tạm dừng game. Vui lòng chờ...
          </p>
        </div>
      </div>
    );
  }

  // Finished state — Victory screen
  if (room.status === 'finished') {
    return (
      <VictoryScreen
        players={players}
        currentPlayerId={currentUserId}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  const currentQuestion = questions[room.currentQuestion];
  if (!currentQuestion) {
    return <LoadingSpinner text="Đang tải câu hỏi..." />;
  }

  return (
    <div className="container-game" style={{ paddingTop: 8, paddingBottom: 24 }}>
      <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />

      {/* Header */}
      <GameHeader roomCode={roomCode} />

      {/* Progress */}
      <div style={{ marginTop: 12, marginBottom: 16 }}>
        <ProgressBar
          current={room.currentQuestion}
          total={SCORING.TOTAL_QUESTIONS}
          urgent={isUrgent}
        />
      </div>

      {/* Timer + Question number */}
      {room.status === 'playing' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Timer timeLeft={timeLeft} progress={progress} isUrgent={isUrgent} />
        </div>
      )}

      {/* PLAYING — Show question */}
      {room.status === 'playing' && (
        <QuestionCard
          question={currentQuestion}
          questionIndex={room.currentQuestion}
          totalQuestions={SCORING.TOTAL_QUESTIONS}
          isRevealed={false}
          onAnswer={handleAnswer}
          hasAnswered={hasAnswered}
          selectedAnswer={selectedAnswer}
        />
      )}

      {/* SHOWING ANSWER — Reveal correct answer */}
      {room.status === 'showing_answer' && (
        <div className="fade-in">
          {/* Score feedback */}
          {lastScore !== null && lastCorrect !== null && (
            <div
              className="card-gold scale-in"
              style={{
                textAlign: 'center',
                marginBottom: 16,
                padding: '16px 20px',
              }}
            >
              <p
                style={{
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  color: lastCorrect ? 'var(--jade)' : 'var(--crimson)',
                }}
              >
                {lastCorrect ? `+${lastScore}` : '+0'}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-light)' }}>
                {getScoreLabel(lastScore)}
              </p>
            </div>
          )}

          <QuestionCard
            question={currentQuestion}
            questionIndex={room.currentQuestion}
            totalQuestions={SCORING.TOTAL_QUESTIONS}
            isRevealed={true}
            onAnswer={() => {}}
            hasAnswered={true}
            selectedAnswer={selectedAnswer}
          />

          {/* Explanation */}
          <DidYouKnow explanation={currentQuestion.explanation} />
        </div>
      )}

      {/* SHOWING LEADERBOARD — Top 5 between questions */}
      {room.status === 'showing_leaderboard' && (
        <div style={{ marginTop: 16 }}>
          <Leaderboard
            players={players}
            limit={5}
            title="🏆 TOP 5"
            currentPlayerId={currentUserId}
          />
        </div>
      )}
    </div>
  );
}
