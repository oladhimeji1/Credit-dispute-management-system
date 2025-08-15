import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { WebSocketProvider } from '@/lib/contexts/websocket-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Credit Veto - Dispute Management Platform',
  description: 'Professional credit dispute management and monitoring platform',
  keywords: ['credit', 'dispute', 'management', 'credit repair', 'financial'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <WebSocketProvider>
              {children}
              <Toaster position="top-right" />
            </WebSocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}