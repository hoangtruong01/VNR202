// ============================================================
// Player Service — Player-only actions (submit answer)
// ============================================================
import { db } from '@/lib/firebase';
import { ref, set, update, get, serverTimestamp } from 'firebase/database';
import { calculateScore } from '@/utils/scoring';
import questions from '@/data/questions';

/**
 * Submit an answer for the current question.
 * Score is calculated based on correctness and speed.
 * Write-once: cannot change answer after submission.
 */
export async function submitAnswer(
  roomCode: string,
  playerId: string,
  questionIndex: number,
  answerIndex: number
): Promise<{ scoreAwarded: number; isCorrect: boolean }> {
  // Get question start time from room
  const roomSnap = await get(ref(db, `rooms/${roomCode}`));
  if (!roomSnap.exists()) throw new Error('ROOM_NOT_FOUND');

  const roomData = roomSnap.val();
  const questionStartedAt = roomData.questionStartedAt;
  const now = Date.now();

  const question = questions[questionIndex];
  const isCorrect = answerIndex === question.correctAnswer;
  const newScoreAwarded = calculateScore(isCorrect, now, questionStartedAt);

  // Check if answer already exists (allow re-selecting/changing answer before time's up)
  const answerRef = ref(db, `rooms/${roomCode}/answers/${playerId}/${questionIndex}`);
  const answerSnap = await get(answerRef);

  let prevScoreAwarded = 0;
  if (answerSnap.exists()) {
    prevScoreAwarded = answerSnap.val().scoreAwarded || 0;
  }

  // Write/overwrite answer record
  await set(answerRef, {
    answer: answerIndex,
    answeredAt: serverTimestamp(),
    scoreAwarded: newScoreAwarded,
  });

  // Update player's total score and current answer status
  const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);
  const playerSnap = await get(playerRef);
  if (playerSnap.exists()) {
    const currentScore = playerSnap.val().score || 0;
    const updatedScore = Math.max(0, currentScore - prevScoreAwarded + newScoreAwarded);
    await update(playerRef, {
      score: updatedScore,
      currentAnswer: answerIndex,
      answeredAt: serverTimestamp(),
    });
  }

  return { scoreAwarded: newScoreAwarded, isCorrect };
}

/**
 * Reset player's currentAnswer for the next question.
 * Called when a new question starts.
 */
export async function resetPlayerAnswer(
  roomCode: string,
  playerId: string
): Promise<void> {
  await update(ref(db, `rooms/${roomCode}/players/${playerId}`), {
    currentAnswer: -1,
    answeredAt: null,
  });
}
