import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shay Ater — Filmmaker',
  description: 'Portfolio of Shay Ater, filmmaker and cinematographer.',
  openGraph: {
    title: 'Shay Ater — Filmmaker',
    description: 'Portfolio of Shay Ater, filmmaker and cinematographer.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${ibmPlexSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
