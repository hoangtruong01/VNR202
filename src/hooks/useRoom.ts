// ============================================================
// useRoom — Listen to room state changes in real-time
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { Room } from '@/types/game';

export function useRoom(roomCode: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    const roomRef = ref(db, `rooms/${roomCode}`);

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setRoom(snapshot.val() as Room);
          setError(null);
        } else {
          setRoom(null);
          setError('ROOM_NOT_FOUND');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Room listener error:', err);
        setError('CONNECTION_ERROR');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => off(roomRef, 'value', unsubscribe);
  }, [roomCode]);

  return { room, loading, error };
}
