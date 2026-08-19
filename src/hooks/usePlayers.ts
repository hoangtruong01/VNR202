// ============================================================
// usePlayers — Listen to player list in real-time
// ============================================================
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { Player, PlayerWithId } from '@/types/game';

export function usePlayers(roomCode: string | null) {
  const [players, setPlayers] = useState<PlayerWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    const playersRef = ref(db, `rooms/${roomCode}/players`);

    const unsubscribe = onValue(
      playersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, Player>;
          const playerList: PlayerWithId[] = Object.entries(data)
            .map(([id, player]) => ({
              id,
              ...player,
            }))
            // Sort by score descending, then by join time
            .sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);

          // Assign ranks
          playerList.forEach((p, i) => {
            p.rank = i + 1;
          });

          setPlayers(playerList);
        } else {
          setPlayers([]);
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => off(playersRef, 'value', unsubscribe);
  }, [roomCode]);

  return { players, loading, playerCount: players.length };
}
