import type { Metadata } from 'next';
import './globals.css'; 
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Reverb: For meaningful chats that "bounce back"',
  description: 'A modern, real-time chat application built with Next.js and Express.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
              {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}