// ============================================================
// DidYouKnow — Historical fact after answer reveal
// ============================================================

interface DidYouKnowProps {
  explanation: string;
}

export default function DidYouKnow({ explanation }: DidYouKnowProps) {
  return (
    <div className="did-you-know fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>📜</span>
        <h4
          className="text-heading"
          style={{ fontSize: '0.9rem', color: 'var(--gold-dark)' }}
        >
          BẠN CÓ BIẾT?
        </h4>
      </div>
      <p
        style={{
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--ink-light)',
          fontFamily: 'var(--font-accent)',
        }}
      >
        {explanation}
      </p>
    </div>
  );
}
