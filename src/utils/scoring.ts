// ============================================================
// Scoring System — Time-based bonus calculation
// ============================================================
import { SCORING } from '@/types/game';

/**
 * Calculate score for a question answer.
 * 
 * Correct + fast = 150 pts (100 base + 50 bonus)
 * Correct + slow = 100 pts (100 base + 0 bonus)
 * Wrong = 0 pts
 * 
 * @param isCorrect - Whether the answer was correct
 * @param answeredAt - Timestamp when player answered
 * @param questionStartedAt - Timestamp when question was shown
 * @returns Score awarded (0-150)
 */
export function calculateScore(
  isCorrect: boolean,
  answeredAt: number,
  questionStartedAt: number
): number {
  if (!isCorrect) return 0;

  const timeTakenMs = answeredAt - questionStartedAt;
  const timeTakenSec = Math.max(0, timeTakenMs / 1000);
  const timeRemaining = Math.max(0, SCORING.TIME_LIMIT - timeTakenSec);

  // Linear bonus: faster = more bonus points
  const timeBonus = Math.round(
    (timeRemaining / SCORING.TIME_LIMIT) * SCORING.MAX_TIME_BONUS
  );

  return SCORING.BASE_SCORE + timeBonus;
}

/**
 * Get a label for the score speed tier
 */
export function getScoreLabel(score: number): string {
  if (score === 0) return 'Sai rồi!';
  if (score >= 140) return 'Xuất sắc! ⚡';
  if (score >= 120) return 'Rất nhanh! 🔥';
  if (score >= 100) return 'Chính xác! ✓';
  return 'Đúng rồi! ✓';
}
