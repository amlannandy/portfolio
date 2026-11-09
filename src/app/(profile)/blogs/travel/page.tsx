import type { Metadata } from 'next';

import TravelBlog from '@portfolio/components/sections/TravelBlog';

export const metadata: Metadata = {
  title: 'Travel blog',
  description: "Places I've lived and worked from.",
};

export default function TravelBlogPage() {
  return <TravelBlog />;
}
