// ============================================================
// Game Types — Đấu Trường Lịch Sử
// ============================================================

/** Game status enum controlling the flow of the game */
export type GameStatus =
  | 'waiting'           // Lobby - waiting for host to start
  | 'playing'           // Question is active, players answering
  | 'paused'            // Host paused the game
  | 'showing_answer'    // Showing correct answer + explanation
  | 'showing_leaderboard' // Showing top 5 between questions
  | 'finished';         // Game over, showing final results

/** A single question in the quiz */
export interface Question {
  id: number;
  question: string;
  answers: [string, string, string, string]; // Exactly 4 answers
  correctAnswer: number; // 0-3 index
  explanation: string;
}

/** Player data stored in Firebase */
export interface Player {
  name: string;
  score: number;
  currentAnswer: number;  // -1 = not answered yet
  answeredAt: number | null;
  isOnline: boolean;
  joinedAt: number;
}

/** Player with ID (for use in components) */
export interface PlayerWithId extends Player {
  id: string;
  rank?: number;
}

/** Answer record for a specific question */
export interface AnswerRecord {
  answer: number;       // 0-3 index of chosen answer
  answeredAt: number;   // Server timestamp
  scoreAwarded: number; // Points earned for this question
}

/** Room data stored in Firebase */
export interface Room {
  hostId: string;
  hostName: string;
  roomName: string;
  status: GameStatus;
  currentQuestion: number;  // 0-indexed
  questionStartedAt: number | null;
  createdAt: number;
  playerCount: number;
  players?: Record<string, Player>;
  answers?: Record<string, Record<string, AnswerRecord>>;
}

/** Scoring constants */
export const SCORING = {
  TIME_LIMIT: 15,       // seconds per question
  BASE_SCORE: 100,      // points for correct answer
  MAX_TIME_BONUS: 50,   // max bonus for fast answer
  TOTAL_QUESTIONS: 15,
  ANSWER_REVEAL_TIME: 4000,     // ms to show answer
  LEADERBOARD_REVEAL_TIME: 4000, // ms to show leaderboard
} as const;
