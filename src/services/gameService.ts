// ============================================================
// Game Service — Host-only game flow control
// ============================================================
import { db } from '@/lib/firebase';
import { ref, update, serverTimestamp } from 'firebase/database';
import { GameStatus, SCORING } from '@/types/game';

/**
 * Start the game — Host only.
 * Sets status to 'playing' and starts question 0.
 */
export async function startGame(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'playing' as GameStatus,
    currentQuestion: 0,
    questionStartedAt: serverTimestamp(),
  });
}

/**
 * Advance to the next question — Host only.
 * If we've reached the last question, finish the game.
 */
export async function nextQuestion(
  roomCode: string,
  currentQuestion: number
): Promise<void> {
  const nextQ = currentQuestion + 1;

  if (nextQ >= SCORING.TOTAL_QUESTIONS) {
    // Game over
    await update(ref(db, `rooms/${roomCode}`), {
      status: 'finished' as GameStatus,
    });
  } else {
    await update(ref(db, `rooms/${roomCode}`), {
      status: 'playing' as GameStatus,
      currentQuestion: nextQ,
      questionStartedAt: serverTimestamp(),
    });
  }
}

/**
 * Set game status — Host only.
 */
export async function setGameStatus(
  roomCode: string,
  status: GameStatus
): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), { status });
}

/**
 * Show the correct answer — Host only.
 * Triggered when timer ends or all players have answered.
 */
export async function showAnswer(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'showing_answer' as GameStatus,
  });
}

/**
 * Show the leaderboard between questions — Host only.
 */
export async function showLeaderboard(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'showing_leaderboard' as GameStatus,
  });
}

/**
 * Pause the game — Host only.
 */
export async function pauseGame(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'paused' as GameStatus,
  });
}

/**
 * Resume the game — Host only.
 * Resumes from pause by setting a new question start time.
 */
export async function resumeGame(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'playing' as GameStatus,
    questionStartedAt: serverTimestamp(),
  });
}

/**
 * End the game immediately — Host only.
 */
export async function endGame(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'finished' as GameStatus,
  });
}

/**
 * Restart the game — Host only.
 * Resets to waiting state so a new game can begin.
 */
export async function restartGame(roomCode: string): Promise<void> {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'waiting' as GameStatus,
    currentQuestion: 0,
    questionStartedAt: null,
  });
}
