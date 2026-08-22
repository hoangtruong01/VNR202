// ============================================================
// Game Service — Host-only game flow control
// ============================================================
import { db } from '@/lib/firebase';
import { ref, update, get, serverTimestamp } from 'firebase/database';
import { GameStatus, SCORING } from '@/types/game';

/**
 * Reset all player answers (currentAnswer → -1) for a room.
 * Called before each new question to prevent stale answer data.
 */
async function resetAllPlayerAnswers(roomCode: string): Promise<void> {
  const playersSnap = await get(ref(db, `rooms/${roomCode}/players`));
  if (!playersSnap.exists()) return;

  const updates: Record<string, unknown> = {};
  Object.keys(playersSnap.val()).forEach((playerId) => {
    updates[`rooms/${roomCode}/players/${playerId}/currentAnswer`] = -1;
    updates[`rooms/${roomCode}/players/${playerId}/answeredAt`] = null;
  });

  await update(ref(db), updates);
}

/**
 * Start the game — Host only.
 * Sets status to 'playing' and starts question 0.
 */
export async function startGame(roomCode: string): Promise<void> {
  // Reset all player answers before starting
  await resetAllPlayerAnswers(roomCode);

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
    // Reset all player answers BEFORE advancing to next question
    await resetAllPlayerAnswers(roomCode);

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
 * Fast-forward the question timer to remaining seconds (e.g. 3s) — Host only.
 * Called when all players have submitted their answers.
 */
export async function fastForwardTimer(
  roomCode: string,
  targetRemainingSeconds: number = 3
): Promise<void> {
  const targetStartedAt = Date.now() - (SCORING.TIME_LIMIT - targetRemainingSeconds) * 1000;
  await update(ref(db, `rooms/${roomCode}`), {
    questionStartedAt: targetStartedAt,
  });
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
