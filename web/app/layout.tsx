import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, backgroundColor: "#ffffff", color: "#111827", fontFamily: "Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
