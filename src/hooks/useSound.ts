// ============================================================
// useSound — Sound effects + Haptic feedback manager
// ============================================================
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type SoundType =
  | 'countdown'
  | 'correct'
  | 'wrong'
  | 'join'
  | 'victory'
  | 'tick'
  | 'click'
  | 'streak'
  | 'perfect';

// Sound configurations using Web Audio API oscillator
const SOUND_CONFIGS: Record<
  SoundType,
  { frequency: number; duration: number; type: OscillatorType; volume: number }
> = {
  countdown: { frequency: 440, duration: 0.15, type: 'sine', volume: 0.3 },
  correct: { frequency: 660, duration: 0.25, type: 'sine', volume: 0.4 },
  wrong: { frequency: 220, duration: 0.4, type: 'sawtooth', volume: 0.3 },
  join: { frequency: 660, duration: 0.15, type: 'sine', volume: 0.2 },
  victory: { frequency: 523, duration: 0.5, type: 'sine', volume: 0.4 },
  tick: { frequency: 600, duration: 0.05, type: 'sine', volume: 0.15 },
  click: { frequency: 500, duration: 0.08, type: 'sine', volume: 0.2 },
  streak: { frequency: 880, duration: 0.4, type: 'sine', volume: 0.35 },
  perfect: { frequency: 1047, duration: 0.35, type: 'sine', volume: 0.35 },
};

// Haptic patterns (vibration in ms)
const HAPTIC_PATTERNS: Partial<Record<SoundType, number[]>> = {
  correct: [50, 30, 50],     // Short double buzz
  wrong: [100, 50, 100, 50, 100], // Triple long buzz
  click: [20],               // Tiny tap
  streak: [30, 20, 30, 20, 60], // Escalating pattern
  perfect: [40, 20, 40, 20, 80], // Special pattern
  victory: [50, 30, 50, 30, 100, 50, 150], // Celebration pattern
};

function triggerHaptic(pattern?: number[]) {
  if (pattern && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silently fail — haptics not available
    }
  }
}

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Lazy-init AudioContext (requires user interaction)
  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      if (!soundEnabled) return;

      // Haptic feedback (works independently of audio)
      triggerHaptic(HAPTIC_PATTERNS[sound]);

      try {
        const ctx = getContext();
        const config = SOUND_CONFIGS[sound];

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

        // Envelope: quick attack, sustain, decay
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          config.volume,
          ctx.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + config.duration
        );

        // Correct sound: ascending two-note melody
        if (sound === 'correct') {
          const osc2 = ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // High note
          osc2.connect(gainNode);
          osc2.start(ctx.currentTime + 0.12);
          osc2.stop(ctx.currentTime + config.duration + 0.1);
        }

        // Streak sound: ascending triple-note chord
        if (sound === 'streak') {
          const notes = [880, 1047, 1319]; // A5, C6, E6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.connect(gainNode);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + config.duration);
          });
        }

        // Perfect sound: sparkling melody
        if (sound === 'perfect') {
          const notes = [1047, 1319, 1568]; // C6, E6, G6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.connect(gainNode);
            osc.start(ctx.currentTime + i * 0.06);
            osc.stop(ctx.currentTime + config.duration);
          });
        }

        // Victory sound: play a chord
        if (sound === 'victory') {
          const osc2 = ctx.createOscillator();
          const osc3 = ctx.createOscillator();
          osc2.type = 'sine';
          osc3.type = 'sine';
          osc2.frequency.setValueAtTime(659, ctx.currentTime); // E5
          osc3.frequency.setValueAtTime(784, ctx.currentTime); // G5
          osc2.connect(gainNode);
          osc3.connect(gainNode);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + config.duration);
          osc3.start(ctx.currentTime + 0.1);
          osc3.stop(ctx.currentTime + config.duration + 0.1);
        }

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration);
      } catch {
        // Silently fail if audio isn't available
      }
    },
    [soundEnabled, getContext]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return { play, soundEnabled, toggleSound };
}
