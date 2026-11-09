import type { Metadata } from 'next';

import Experience from '@portfolio/components/sections/Experience';

export const metadata: Metadata = {
  description: 'Where Amlan Kumar Nandy has worked and what they built there.',
};

export default function HomePage() {
  return <Experience />;
}
