// ============================================================
// useTimer — Countdown timer with animation support
// ============================================================
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SCORING } from '@/types/game';

interface UseTimerReturn {
  timeLeft: number;
  progress: number; // 0-1, for progress bar
  isExpired: boolean;
  isUrgent: boolean; // Last 5 seconds
}

export function useTimer(
  questionStartedAt: number | null,
  isActive: boolean,
  onExpire?: () => void
): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState<number>(SCORING.TIME_LIMIT);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);

  // Keep callback ref up to date
  onExpireRef.current = onExpire;

  const calculateTimeLeft = useCallback(() => {
    if (!questionStartedAt) return SCORING.TIME_LIMIT;
    const elapsed = (Date.now() - questionStartedAt) / 1000;
    return Math.max(0, SCORING.TIME_LIMIT - elapsed);
  }, [questionStartedAt]);

  useEffect(() => {
    if (!isActive || !questionStartedAt) {
      setTimeLeft(SCORING.TIME_LIMIT);
      hasExpiredRef.current = false;
      return;
    }

    hasExpiredRef.current = false;

    // Update timer every 100ms for smooth animation
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, questionStartedAt, calculateTimeLeft]);

  return {
    timeLeft: Math.ceil(timeLeft),
    progress: timeLeft / SCORING.TIME_LIMIT,
    isExpired: timeLeft <= 0,
    isUrgent: timeLeft <= 5 && timeLeft > 0,
  };
}
