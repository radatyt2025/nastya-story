import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Marck_Script } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--f-serif' });
const sans = Inter({ subsets: ['cyrillic', 'latin'], variable: '--f-sans' });
const hand = Marck_Script({ subsets: ['cyrillic', 'latin'], weight: '400', variable: '--f-hand' });

export const metadata: Metadata = { title: 'Special Evening ♡ | Для Насті', description: 'Особливий вечір. Наша історія — і ще один спогад попереду.', robots: { index: false, follow: false } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#101014' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
      <body className="bg-night font-sans text-ivory antialiased">{children}</body>
    </html>
  );
}
