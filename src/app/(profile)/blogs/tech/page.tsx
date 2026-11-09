import type { Metadata } from 'next';

import TechBlog from '@portfolio/components/sections/TechBlog';

export const metadata: Metadata = {
  title: 'Tech blog',
  description: 'Notes on building software.',
};

export default function TechBlogPage() {
  return <TechBlog />;
}
