// ============================================================
// Formatting Utilities
// ============================================================

/**
 * Format score with comma separators
 */
export function formatScore(score: number): string {
  return score.toLocaleString('vi-VN');
}

/**
 * Get rank emoji for top 3
 */
export function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `${rank}.`;
  }
}

/**
 * Get rank label in Vietnamese
 */
export function getRankLabel(rank: number): string {
  switch (rank) {
    case 1: return 'Hạng 1';
    case 2: return 'Hạng 2';
    case 3: return 'Hạng 3';
    default: return `Hạng ${rank}`;
  }
}

/**
 * Truncate player name if too long
 */
export function truncateName(name: string, maxLength: number = 15): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 1) + '…';
}
