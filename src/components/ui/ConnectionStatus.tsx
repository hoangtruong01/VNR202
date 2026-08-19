// ============================================================
// ConnectionStatus — Displays connection bar when offline
// ============================================================
'use client';

import { useConnectionStatus } from '@/hooks/useConnectionStatus';

export default function ConnectionStatus() {
  const isConnected = useConnectionStatus();

  if (isConnected) return null;

  return (
    <div className="connection-bar connection-bar-disconnected">
      🔴 Mất kết nối — Đang thử kết nối lại...
    </div>
  );
}
