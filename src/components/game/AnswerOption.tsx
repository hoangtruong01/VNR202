// ============================================================
// AnswerOption — Individual answer button with states
// ============================================================
'use client';

interface AnswerOptionProps {
  index: number;
  text: string;
  selected: boolean;
  isCorrect?: boolean | null; // null = not revealed yet
  isRevealed: boolean;
  disabled: boolean;
  onClick: () => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function AnswerOption({
  index,
  text,
  selected,
  isCorrect,
  isRevealed,
  disabled,
  onClick,
}: AnswerOptionProps) {
  let className = 'answer-option';

  if (disabled) className += ' answer-disabled';
  if (selected && !isRevealed) className += ' answer-selected';
  if (isRevealed && isCorrect) className += ' answer-correct';
  if (isRevealed && selected && !isCorrect) className += ' answer-wrong';

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      id={`answer-${index}`}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      <span className="answer-label">{LABELS[index]}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{text}</span>
      {isRevealed && isCorrect && (
        <span style={{ fontSize: '1.2rem' }}>✓</span>
      )}
      {isRevealed && selected && !isCorrect && (
        <span style={{ fontSize: '1.2rem' }}>✗</span>
      )}
    </button>
  );
}
