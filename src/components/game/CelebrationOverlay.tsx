// ============================================================
// CelebrationOverlay — Visual celebration when answering correctly
// Shows emoji burst + text animation, auto-dismisses after 1.5s
// ============================================================
'use client';

import { useEffect, useState } from 'react';

interface CelebrationOverlayProps {
  score: number;
  streak: number;
  visible: boolean;
}

function getCelebrationData(score: number, streak: number) {
  // Streak-based emoji escalation
  if (streak >= 5) {
    return { emoji: '💎', text: 'HUYỀN THOẠI!', tier: 'legendary' };
  }
  if (streak >= 3) {
    return { emoji: '🔥', text: `CHUỖI ${streak} CÂU!`, tier: 'fire' };
  }

  // Score-based feedback
  if (score >= 140) {
    return { emoji: '⚡', text: 'XUẤT SẮC!', tier: 'perfect' };
  }
  if (score >= 120) {
    return { emoji: '🌟', text: 'RẤT NHANH!', tier: 'great' };
  }
  return { emoji: '🎉', text: 'CHÍNH XÁC!', tier: 'correct' };
}

// Generate random particles for CSS animation
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  emoji: ['⭐', '✨', '🌟', '💫', '🎯', '🏆'][i % 6],
  angle: (i * 30) + Math.random() * 20 - 10,
  distance: 60 + Math.random() * 80,
  delay: Math.random() * 0.3,
  size: 0.7 + Math.random() * 0.6,
}));

export default function CelebrationOverlay({
  score,
  streak,
  visible,
}: CelebrationOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1800);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!show) return null;

  const { emoji, text, tier } = getCelebrationData(score, streak);

  return (
    <div className="celebration-overlay" aria-hidden="true">
      {/* Central emoji */}
      <div className={`celebration-emoji celebration-tier-${tier}`}>
        {emoji}
      </div>

      {/* Text label */}
      <div className={`celebration-text celebration-tier-${tier}`}>
        {text}
      </div>

      {/* Score number */}
      <div className="celebration-score">
        +{score}
      </div>

      {/* Particle burst */}
      <div className="celebration-particles">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="celebration-particle"
            style={{
              '--angle': `${p.angle}deg`,
              '--distance': `${p.distance}px`,
              '--delay': `${p.delay}s`,
              '--size': p.size,
              fontSize: `${p.size}rem`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
