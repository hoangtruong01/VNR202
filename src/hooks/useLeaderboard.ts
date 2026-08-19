// ============================================================
// useLeaderboard — Sorted & ranked player list for leaderboard
// ============================================================
'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { PlayerWithId } from '@/types/game';

interface LeaderboardEntry extends PlayerWithId {
  rankChange: 'up' | 'down' | 'same' | 'new';
  previousRank?: number;
}

export function useLeaderboard(players: PlayerWithId[]): {
  leaderboard: LeaderboardEntry[];
  leader: LeaderboardEntry | null;
  leaderChanged: boolean;
} {
  const previousRanks = useRef<Record<string, number>>({});
  const previousLeader = useRef<string | null>(null);
  const [leaderChanged, setLeaderChanged] = useState(false);

  const leaderboard = useMemo(() => {
    const sorted = [...players]
      .sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt)
      .map((player, index): LeaderboardEntry => {
        const rank = index + 1;
        const prevRank = previousRanks.current[player.id];
        let rankChange: LeaderboardEntry['rankChange'] = 'same';

        if (prevRank === undefined) {
          rankChange = 'new';
        } else if (rank < prevRank) {
          rankChange = 'up';
        } else if (rank > prevRank) {
          rankChange = 'down';
        }

        return {
          ...player,
          rank,
          rankChange,
          previousRank: prevRank,
        };
      });

    // Update previous ranks for next comparison
    const newRanks: Record<string, number> = {};
    sorted.forEach((p) => {
      newRanks[p.id] = p.rank!;
    });
    previousRanks.current = newRanks;

    return sorted;
  }, [players]);

  const leader = leaderboard.length > 0 ? leaderboard[0] : null;

  // Detect leader change
  useEffect(() => {
    if (leader && previousLeader.current && leader.id !== previousLeader.current) {
      setLeaderChanged(true);
      const timeout = setTimeout(() => setLeaderChanged(false), 3000);
      return () => clearTimeout(timeout);
    }
    if (leader) {
      previousLeader.current = leader.id;
    }
  }, [leader]);

  return { leaderboard, leader, leaderChanged };
}
