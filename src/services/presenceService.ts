// ============================================================
// Presence Service — Online/offline detection
// ============================================================
import { db } from '@/lib/firebase';
import { ref, onValue, onDisconnect, set } from 'firebase/database';

/**
 * Set up presence tracking for a player.
 * Marks player as online and sets up onDisconnect to mark offline.
 */
export function setupPresence(
  roomCode: string,
  playerId: string
): () => void {
  const playerOnlineRef = ref(
    db,
    `rooms/${roomCode}/players/${playerId}/isOnline`
  );
  const connectedRef = ref(db, '.info/connected');

  const unsubscribe = onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
      // Connected: mark as online and set up disconnect handler
      set(playerOnlineRef, true);
      onDisconnect(playerOnlineRef).set(false);
    }
  });

  return unsubscribe;
}

/**
 * Mark a player as online (e.g., after reconnection).
 */
export async function markOnline(
  roomCode: string,
  playerId: string
): Promise<void> {
  await set(
    ref(db, `rooms/${roomCode}/players/${playerId}/isOnline`),
    true
  );
}
