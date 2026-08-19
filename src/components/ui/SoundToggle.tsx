// ============================================================
// SoundToggle — Floating sound on/off button
// ============================================================
'use client';

interface SoundToggleProps {
  soundEnabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ soundEnabled, onToggle }: SoundToggleProps) {
  return (
    <button
      className="sound-toggle"
      onClick={onToggle}
      aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
    >
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  );
}
