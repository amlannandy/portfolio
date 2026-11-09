import type { Metadata } from 'next';

import TechBlog from '@portfolio/components/sections/TechBlog';

import { BLOGS } from '@portfolio/data/blogs';
import { getPosts } from '@portfolio/lib/posts';

export const metadata: Metadata = {
  title: 'Tech Writeups',
  description: 'Notes on building software.',
};

// Posts only change with a deploy, so read them once when this module loads. Doing it here
// rather than in the component keeps the route fully static, with no revalidation.
const posts = await getPosts('tech');

export default function TechBlogPage() {
  return <TechBlog posts={posts} blog={BLOGS.tech} />;
}
