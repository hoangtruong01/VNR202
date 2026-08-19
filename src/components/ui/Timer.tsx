// ============================================================
// Timer — Circular countdown with SVG ring
// ============================================================
'use client';

interface TimerProps {
  timeLeft: number;
  progress: number;
  isUrgent: boolean;
}

export default function Timer({ timeLeft, progress, isUrgent }: TimerProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`timer-circle ${isUrgent ? 'timer-urgent' : ''}`}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="var(--parchment-dark)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={isUrgent ? 'var(--crimson)' : 'var(--gold)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <span className="timer-number">{timeLeft}</span>
    </div>
  );
}
