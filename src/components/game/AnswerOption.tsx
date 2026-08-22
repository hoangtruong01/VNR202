// ============================================================
// AnswerOption — Individual answer button with reveal drama
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

  // Reveal drama animations
  if (isRevealed) {
    if (isCorrect) {
      className += ' answer-correct answer-reveal-correct';
    } else if (selected && !isCorrect) {
      className += ' answer-wrong answer-reveal-selected-wrong';
    } else {
      className += ' answer-reveal-wrong';
    }
  }

  // Stagger reveal delay for drama
  const revealDelay = isRevealed ? `${index * 100 + 50}ms` : '0ms';

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      id={`answer-${index}`}
      style={{
        animationDelay: isRevealed ? revealDelay : `${index * 80}ms`,
      }}
    >
      <span className="answer-label">{LABELS[index]}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{text}</span>
      {selected && !isRevealed && (
        <span style={{ fontSize: '1.1rem', color: 'var(--gold-dark)', fontWeight: 800, animation: 'scaleIn 0.3s ease both' }}>✓</span>
      )}
      {isRevealed && isCorrect && (
        <span style={{ fontSize: '1.2rem', animation: 'celebration-pop 0.4s ease both', animationDelay: '0.3s' }}>✅</span>
      )}
      {isRevealed && selected && !isCorrect && (
        <span style={{ fontSize: '1.2rem' }}>❌</span>
      )}
    </button>
  );
}

