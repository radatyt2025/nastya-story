import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Marck_Script } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--f-serif' });
const sans = Inter({ subsets: ['cyrillic', 'latin'], variable: '--f-sans' });
const hand = Marck_Script({ subsets: ['cyrillic', 'latin'], weight: '400', variable: '--f-hand' });

export const metadata: Metadata = {
  metadataBase: new URL('https://special-evening.vercel.app'),
  title: 'Special Evening ♡',
  description: 'One evening. One story. Just for you.',
  openGraph: {
    type: 'website',
    url: 'https://special-evening.vercel.app',
    title: 'Special Evening ♡',
    description: 'One evening. One story. Just for you.',
    images: [{ url: '/photos/IMG_3859.jpeg', width: 1280, height: 960, alt: 'Наш особливий момент' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Special Evening ♡',
    description: 'One evening. One story. Just for you.',
    images: ['/photos/IMG_3859.jpeg'],
  },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#101014' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
      <body className="bg-night font-sans text-ivory antialiased">{children}</body>
    </html>
  );
}
