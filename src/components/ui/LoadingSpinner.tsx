// ============================================================
// Loading Spinner Component
// ============================================================
export default function LoadingSpinner({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, minHeight: '60vh' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
        {text}
      </p>
    </div>
  );
}
