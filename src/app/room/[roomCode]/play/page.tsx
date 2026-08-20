// ============================================================
// Player Game View — The main game experience for players
// Enhanced with celebrations, streaks, and micro-interactions
// ============================================================
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { usePlayers } from '@/hooks/usePlayers';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { submitAnswer, resetPlayerAnswer } from '@/services/playerService';
import { fastForwardTimer } from '@/services/gameService';
import { setupPresence } from '@/services/presenceService';
import { auth } from '@/lib/firebase';
import questions from '@/data/questions';
import { SCORING } from '@/types/game';
import confetti from 'canvas-confetti';
import GameHeader from '@/components/layout/GameHeader';
import QuestionCard from '@/components/game/QuestionCard';
import AnswerProgressCard from '@/components/game/AnswerProgressCard';
import DidYouKnow from '@/components/game/DidYouKnow';
import Leaderboard from '@/components/game/Leaderboard';
import VictoryScreen from '@/components/game/VictoryScreen';
import CelebrationOverlay from '@/components/game/CelebrationOverlay';
import ScorePopup from '@/components/game/ScorePopup';
import Timer from '@/components/ui/Timer';
import ProgressBar from '@/components/ui/ProgressBar';
import SoundToggle from '@/components/ui/SoundToggle';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { showToast } from '@/components/ui/Toast';

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

  // Answer progress tracking
  const totalPlayers = players.length;
  const answeredCount = players.filter(
    (p) => p.currentAnswer !== undefined && p.currentAnswer !== -1
  ).length;
  const isAllAnswered = totalPlayers > 0 && answeredCount >= totalPlayers;

  // Streak tracking (#2)
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationKeyRef = useRef(0);

  const currentUserId = auth?.currentUser?.uid;
  const prevQuestionRef = useRef<number>(-1);

  // Timer — player-side (for visual feedback only; host controls transitions)
  const { timeLeft, progress, isUrgent } = useTimer(
    room?.questionStartedAt || null,
    room?.status === 'playing'
  );

  // Auto fast-forward timer to 3s if host & everyone has answered
  useEffect(() => {
    if (
      room?.status === 'playing' &&
      isAllAnswered &&
      timeLeft > 3 &&
      currentUserId &&
      room.hostId === currentUserId
    ) {
      fastForwardTimer(roomCode, 3).catch(() => {});
    }
  }, [room?.status, isAllAnswered, timeLeft, currentUserId, room?.hostId, roomCode]);

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
      setShowCelebration(false);
      prevQuestionRef.current = room.currentQuestion;

      // Reset answer in Firebase
      if (currentUserId) {
        resetPlayerAnswer(roomCode, currentUserId).catch(() => {});
      }
    }
  }, [room?.currentQuestion, roomCode, currentUserId, room]);

  // (#1) Mini confetti + celebration on correct answer reveal
  useEffect(() => {
    if (room?.status === 'showing_answer' && lastCorrect !== null) {
      if (lastCorrect) {
        // Fire mini confetti burst
        const colors = ['#C4972F', '#FFD700', '#E8D5A3', '#1B5E20'];

        // Center burst
        confetti({
          particleCount: streak >= 3 ? 60 : 30,
          spread: streak >= 3 ? 80 : 50,
          origin: { x: 0.5, y: 0.5 },
          colors,
          gravity: 1.2,
          scalar: 0.9,
          ticks: 80,
        });

        // Side bursts for streaks
        if (streak >= 3) {
          setTimeout(() => {
            confetti({
              particleCount: 20,
              angle: 60,
              spread: 40,
              origin: { x: 0, y: 0.6 },
              colors,
            });
            confetti({
              particleCount: 20,
              angle: 120,
              spread: 40,
              origin: { x: 1, y: 0.6 },
              colors,
            });
          }, 200);
        }

        // Show celebration overlay
        celebrationKeyRef.current += 1;
        setShowCelebration(true);

        // Play enhanced sounds based on performance
        if (streak >= 3) {
          play('streak');
        } else if (lastScore !== null && lastScore >= 140) {
          play('perfect');
        } else {
          play('correct');
        }
      } else {
        play('wrong');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status]);

  const handleAnswer = useCallback(
    async (answerIndex: number) => {
      if (!currentUserId || !room || room.status !== 'playing') return;

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

        // Update streak
        if (result.isCorrect) {
          setStreak((prev) => prev + 1);
        } else {
          setStreak(0);
        }
      } catch (err) {
        showToast('Lỗi khi gửi câu trả lời', 'error');
      }
    },
    [currentUserId, room, roomCode, play]
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

  // Streak badge helper
  const getStreakBadge = () => {
    if (streak < 2) return null;
    let badgeClass = 'streak-badge streak-badge-normal';
    let emoji = '🔥';
    if (streak >= 5) {
      badgeClass = 'streak-badge streak-badge-legendary';
      emoji = '💎';
    } else if (streak >= 3) {
      badgeClass = 'streak-badge streak-badge-fire';
      emoji = '🔥';
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <span className={badgeClass} key={streak}>
          {emoji} Chuỗi {streak} câu đúng!
        </span>
      </div>
    );
  };

  return (
    <div className="container-game" style={{ paddingTop: 8, paddingBottom: 24 }}>
      <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />

      {/* Celebration Overlay (#1) */}
      <CelebrationOverlay
        key={celebrationKeyRef.current}
        score={lastScore || 0}
        streak={streak}
        visible={showCelebration}
      />

      {/* Header */}
      <GameHeader roomCode={roomCode} />

      {/* Streak Badge (#2) */}
      {streak >= 2 && room.status === 'playing' && getStreakBadge()}

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
        <>
          <QuestionCard
            question={currentQuestion}
            questionIndex={room.currentQuestion}
            totalQuestions={SCORING.TOTAL_QUESTIONS}
            isRevealed={false}
            onAnswer={handleAnswer}
            hasAnswered={hasAnswered}
            selectedAnswer={selectedAnswer}
          />
          <AnswerProgressCard
            answeredCount={answeredCount}
            totalPlayers={totalPlayers}
            isAllAnswered={isAllAnswered}
          />
        </>
      )}

      {/* SHOWING ANSWER — Reveal correct answer */}
      {room.status === 'showing_answer' && (
        <div className="fade-in">
          {/* Streak Badge during answer reveal */}
          {streak >= 2 && getStreakBadge()}

          {/* Score feedback — Animated popup (#3) */}
          {lastScore !== null && lastCorrect !== null && (
            <ScorePopup
              score={lastScore}
              isCorrect={lastCorrect}
              visible={true}
            />
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
