import type { Metadata } from 'next';

import About from '@portfolio/components/sections/About';
import Experience from '@portfolio/components/sections/Experience';

import { EXPERIENCE } from '@portfolio/data/experience';
import { PROFILE } from '@portfolio/data/profile';

export const metadata: Metadata = {
  description:
    'About Amlan Kumar Nandy, where they have worked and their open source contributions.',
};

export default function HomePage() {
  return (
    <>
      <About paragraphs={PROFILE.about} />
      <Experience groups={EXPERIENCE} />
    </>
  );
}
