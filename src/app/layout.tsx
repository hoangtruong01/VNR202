import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/Toast";
import ConnectionStatus from "@/components/ui/ConnectionStatus";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Đấu Trường Lịch Sử — Game Show Lịch Sử Realtime",
  description:
    "Bạn hiểu lịch sử Việt Nam đến đâu? Tham gia Đấu Trường Lịch Sử — 15 câu hỏi, multiplayer realtime, bảng xếp hạng trực tiếp.",
  keywords: ["lịch sử Việt Nam", "quiz game", "multiplayer", "realtime", "game show"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-parchment">
        {/* Historical background pattern */}
        <div className="bg-historical-pattern" aria-hidden="true" />

        {/* Main content */}
        <main style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          {children}
        </main>

        {/* Global utilities */}
        <ToastContainer />
        <ConnectionStatus />
      </body>
    </html>
  );
}
