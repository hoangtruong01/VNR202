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
      if (hasAnswered || isRevealed) return;
      setLocalSelected(index);
      onAnswer(index);
    },
    [hasAnswered, isRevealed, onAnswer]
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
          marginBottom: 20,
          textAlign: 'center',
          padding: '24px 20px',
        }}
      >
        <h2
          className="text-heading"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.35rem)',
            lineHeight: 1.5,
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
            disabled={hasAnswered || isRevealed}
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
            padding: 12,
            background: 'rgba(196, 151, 47, 0.1)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            color: 'var(--gold-dark)',
          }}
        >
          ✓ Đã ghi nhận câu trả lời
        </div>
      )}
    </div>
  );
}
