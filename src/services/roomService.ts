// ============================================================
// Room Service — Create, join, and manage rooms
// ============================================================
import { db, auth } from '@/lib/firebase';
import {
  ref,
  set,
  get,
  update,
  serverTimestamp,
  onDisconnect,
  increment,
} from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { generateRoomCode } from '@/utils/roomCode';
import { GameStatus } from '@/types/game';

/**
 * Ensure user is anonymously authenticated.
 * Returns the user's UID.
 */
export async function ensureAuth(): Promise<string> {
  if (auth?.currentUser) return auth.currentUser.uid;
  try {
    const result = await signInAnonymously(auth);
    return result.user.uid;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (
      error?.code === 'auth/api-key-not-valid' ||
      error?.code === 'auth/invalid-api-key' ||
      error?.message?.includes('api-key-not-valid')
    ) {
      throw new Error('FIREBASE_NOT_CONFIGURED');
    }
    throw err;
  }
}

/**
 * Create a new game room.
 * @returns The room code
 */
export async function createRoom(
  hostName: string,
  roomName: string
): Promise<string> {
  const hostId = await ensureAuth();

  // Generate unique room code (retry if exists)
  let roomCode = generateRoomCode();
  let attempts = 0;
  while (attempts < 10) {
    const snapshot = await get(ref(db, `rooms/${roomCode}`));
    if (!snapshot.exists()) break;
    roomCode = generateRoomCode();
    attempts++;
  }

  // Create room in Firebase
  await set(ref(db, `rooms/${roomCode}`), {
    hostId,
    hostName,
    roomName,
    status: 'waiting' as GameStatus,
    currentQuestion: 0,
    questionStartedAt: null,
    createdAt: serverTimestamp(),
    playerCount: 0,
  });

  return roomCode;
}

/**
 * Join an existing room as a player.
 * @returns The player's UID
 */
export async function joinRoom(
  roomCode: string,
  playerName: string
): Promise<string> {
  const playerId = await ensureAuth();

  // Check room exists
  const roomSnap = await get(ref(db, `rooms/${roomCode}`));
  if (!roomSnap.exists()) {
    throw new Error('ROOM_NOT_FOUND');
  }

  const roomData = roomSnap.val();

  // Check room status
  if (roomData.status === 'finished') {
    throw new Error('ROOM_FINISHED');
  }

  // Check for duplicate nickname
  if (roomData.players) {
    const existingNames = Object.values(roomData.players).map(
      (p: unknown) => (p as { name: string }).name.toLowerCase()
    );
    if (existingNames.includes(playerName.toLowerCase())) {
      throw new Error('NAME_TAKEN');
    }
  }

  // Add player to room
  const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);
  await set(playerRef, {
    name: playerName,
    score: 0,
    currentAnswer: -1,
    answeredAt: null,
    isOnline: true,
    joinedAt: serverTimestamp(),
  });

  // Increment player count
  await update(ref(db, `rooms/${roomCode}`), {
    playerCount: increment(1),
  });

  // Set up presence: mark offline on disconnect
  onDisconnect(ref(db, `rooms/${roomCode}/players/${playerId}/isOnline`)).set(
    false
  );

  return playerId;
}

/**
 * Check if a room exists and get its status.
 */
export async function checkRoom(
  roomCode: string
): Promise<{ exists: boolean; status?: GameStatus; roomName?: string }> {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  if (!snapshot.exists()) {
    return { exists: false };
  }
  const data = snapshot.val();
  return {
    exists: true,
    status: data.status,
    roomName: data.roomName,
  };
}
