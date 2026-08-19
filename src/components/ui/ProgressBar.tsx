// ============================================================
// ProgressBar — Question progress indicator
// ============================================================

interface ProgressBarProps {
  current: number;
  total: number;
  urgent?: boolean;
}

export default function ProgressBar({ current, total, urgent }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="progress-bar">
      <div
        className={`progress-bar-fill ${urgent ? 'progress-urgent' : ''}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
