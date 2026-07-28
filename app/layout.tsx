import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Preloader } from '@/components/providers/Preloader';
import { Navbar } from '@/components/layout/Navbar';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { SITE } from '@/lib/constants';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${SITE.product} — ${SITE.tagline}`,
  description:
    'A resolable, single-hide leather sandal built to be repaired, not replaced. Made for the walk you did not plan.',
  openGraph: {
    title: SITE.product,
    description: SITE.tagline,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0C10',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink font-sans text-sand antialiased">
        <Preloader />
        <CustomCursor />
        <Navbar />
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
