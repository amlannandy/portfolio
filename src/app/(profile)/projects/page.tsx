import type { Metadata } from 'next';

import Projects from '@portfolio/components/sections/Projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Side projects and apps built by Amlan Kumar Nandy.',
};

export default function ProjectsPage() {
  return <Projects />;
}
