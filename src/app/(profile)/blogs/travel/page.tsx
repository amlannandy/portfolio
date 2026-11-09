import type { Metadata } from 'next';

import TravelBlog from '@portfolio/components/sections/TravelBlog';

import { BLOGS } from '@portfolio/data/blogs';
import { getPosts } from '@portfolio/lib/posts';

export const metadata: Metadata = {
  title: 'Travel Stories',
  description: "Places I've lived and worked from.",
};

// Posts only change with a deploy, so read them once when this module loads. Doing it here
// rather than in the component keeps the route fully static, with no revalidation.
const posts = await getPosts('travel');

export default function TravelBlogPage() {
  return <TravelBlog posts={posts} blog={BLOGS.travel} />;
}
