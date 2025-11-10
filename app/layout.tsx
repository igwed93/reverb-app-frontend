import type { Metadata } from 'next';
import './globals.css'; 
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
  title: "Reverb — Connect, Communicate, Create",
  description: "A real-time chat app built with Next.js, Express, MongoDB, and Socket.io for seamless communication that bounces back.",
  openGraph: {
    title: "Reverb — Connect, Communicate, Create",
    description: "Experience next-level communication with Reverb. Built with Next.js, Express, MongoDB, and Socket.io.",
    url: "https://reverb-app-frontend.vercel.app",
    siteName: "Reverb",
    images: [
      {
        url: "https://reverb-app-frontend.vercel.app/reverb-preview.png",
        width: 1200,
        height: 630,
        alt: "Reverb Chat App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reverb — Connect, Communicate, Create",
    description: "Real-time chat built with Next.js, Express, MongoDB, and Socket.io.",
    images: ["https://reverb-app-frontend.vercel.app/reverb-preview.png"],
  },
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
