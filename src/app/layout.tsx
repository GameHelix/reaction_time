import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reflex Arena — Reaction Time Game',
  description: 'Test your reflexes in this neon-themed reaction time game. Challenge yourself across easy, medium, and hard difficulties.',
  keywords: ['reaction time', 'reflex', 'game', 'speed test', 'neon'],
  openGraph: {
    title: 'Reflex Arena',
    description: 'Test your reaction time in this neon arcade game',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
