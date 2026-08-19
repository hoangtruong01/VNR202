// ============================================================
// useSound — Sound effects manager with Web Audio API
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
  | 'click';

// Sound configurations using Web Audio API oscillator
const SOUND_CONFIGS: Record<
  SoundType,
  { frequency: number; duration: number; type: OscillatorType; volume: number }
> = {
  countdown: { frequency: 440, duration: 0.15, type: 'sine', volume: 0.3 },
  correct: { frequency: 880, duration: 0.3, type: 'sine', volume: 0.4 },
  wrong: { frequency: 220, duration: 0.4, type: 'sawtooth', volume: 0.3 },
  join: { frequency: 660, duration: 0.15, type: 'sine', volume: 0.2 },
  victory: { frequency: 523, duration: 0.5, type: 'sine', volume: 0.4 },
  tick: { frequency: 600, duration: 0.05, type: 'sine', volume: 0.15 },
  click: { frequency: 500, duration: 0.08, type: 'sine', volume: 0.2 },
};

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
