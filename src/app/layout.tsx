import { jakarta } from './fonts';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={jakarta.variable} style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
