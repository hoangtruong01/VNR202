// ============================================================
// Room Code Generator
// ============================================================

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude I, O, 0, 1 to avoid confusion

/**
 * Generate a 6-character room code that's easy to read and type.
 * Excludes ambiguous characters (I/1, O/0).
 */
export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}
