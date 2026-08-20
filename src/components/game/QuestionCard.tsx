// ============================================================
// QuestionCard — Displays the current question with answers
// ============================================================
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Question } from '@/types/game';
import AnswerOption from './AnswerOption';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  isRevealed: boolean;
  onAnswer: (answerIndex: number) => void;
  hasAnswered: boolean;
  selectedAnswer: number;
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  isRevealed,
  onAnswer,
  hasAnswered,
  selectedAnswer,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<number>(-1);

  // Reset selection when question changes
  useEffect(() => {
    setLocalSelected(selectedAnswer);
  }, [questionIndex, selectedAnswer]);

  const handleClick = useCallback(
    (index: number) => {
      if (isRevealed) return;
      setLocalSelected(index);
      onAnswer(index);
    },
    [isRevealed, onAnswer]
  );

  return (
    <div className="slide-up">
      {/* Question number */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
          Câu {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Question text */}
      <div
        className="card-elevated"
        style={{
          marginBottom: 16,
          textAlign: 'center',
          padding: '22px 18px',
        }}
      >
        <h2
          className="text-heading"
          style={{
            fontSize: 'clamp(1.15rem, 4.5vw, 1.4rem)',
            lineHeight: 1.5,
            color: 'var(--ink)',
            fontWeight: 800,
          }}
        >
          {question.question}
        </h2>
      </div>

      {/* Answer options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {question.answers.map((answer, index) => (
          <AnswerOption
            key={index}
            index={index}
            text={answer}
            selected={localSelected === index}
            isCorrect={
              isRevealed ? index === question.correctAnswer : null
            }
            isRevealed={isRevealed}
            disabled={isRevealed}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      {/* Answered confirmation */}
      {hasAnswered && !isRevealed && (
        <div
          className="fade-in"
          style={{
            textAlign: 'center',
            marginTop: 16,
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFDF7 100%)',
            border: '1.5px solid var(--gold)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--ink)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          ✓ Đã ghi nhận đáp án! (Có thể bấm chọn lại trước khi hết giờ)
        </div>
      )}
    </div>
  );
}
