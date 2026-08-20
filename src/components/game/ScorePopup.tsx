// ============================================================
// ScorePopup — Animated score display with count-up effect
// Replaces the static card-gold score feedback
// ============================================================
'use client';

import { useEffect, useState, useRef } from 'react';

interface ScorePopupProps {
  score: number;
  isCorrect: boolean;
  visible: boolean;
}

function getScoreTier(score: number) {
  if (score === 0) return { label: 'Sai rồi!', icon: '😔', className: 'score-wrong' };
  if (score >= 140) return { label: 'Xuất sắc!', icon: '⚡', className: 'score-perfect' };
  if (score >= 120) return { label: 'Rất nhanh!', icon: '🔥', className: 'score-great' };
  if (score >= 100) return { label: 'Chính xác!', icon: '✓', className: 'score-correct' };
  return { label: 'Đúng rồi!', icon: '✓', className: 'score-correct' };
}

export default function ScorePopup({ score, isCorrect, visible }: ScorePopupProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef<number | null>(null);

  // Count-up animation
  useEffect(() => {
    if (!visible || score === 0) {
      setDisplayScore(score);
      return;
    }

    const duration = 600; // ms
    const startTime = Date.now();
    const startVal = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startVal + (score - startVal) * eased));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score, visible]);

  if (!visible) return null;

  const tier = getScoreTier(score);

  return (
    <div className={`score-popup ${tier.className} ${isCorrect ? 'score-popup-correct' : 'score-popup-wrong'}`}>
      {/* Score number with count-up */}
      <div className="score-popup-number">
        <span className="score-popup-sign">{isCorrect ? '+' : ''}</span>
        <span className="score-popup-value">{displayScore}</span>
      </div>

      {/* Tier label */}
      <div className="score-popup-label">
        <span>{tier.icon}</span> {tier.label}
      </div>

      {/* Glow ring for high scores */}
      {score >= 140 && <div className="score-popup-glow" />}
    </div>
  );
}
