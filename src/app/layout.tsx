import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@portfolio/lib/site';
import { THEME_INIT_SCRIPT } from '@portfolio/lib/theme';

import './globals.scss';

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // The head script sets data-theme before React hydrates.
    <html lang="en" className={plexMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
