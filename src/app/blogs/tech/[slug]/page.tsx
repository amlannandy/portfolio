import { Suspense } from 'react';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { MDXModule } from 'mdx/types';

import Post from '@portfolio/components/sections/Post';
import PostSkeleton from '@portfolio/components/sections/PostSkeleton';
import ContentImage from '@portfolio/components/ui/ContentImage';

import { BLOGS } from '@portfolio/data/blogs';
import { getBlogImages } from '@portfolio/lib/images';
import { getPostMetadata, getPostParams } from '@portfolio/lib/postRoutes';
import type { PostParams } from '@portfolio/lib/postRoutes';
import { getPosts } from '@portfolio/lib/posts';
import type { PostSummary } from '@portfolio/types/post';

// Read once when this module loads, like the listing, so every post is prerendered at build time.
const posts = await getPosts('tech');
const images = await getBlogImages('tech');

const findPost = async (
  params: PageProps<'/blogs/tech/[slug]'>['params']
): Promise<PostSummary | undefined> => {
  const { slug } = await params;
  return posts.find((post) => post.slug === slug);
};

export async function generateStaticParams(): Promise<PostParams[]> {
  return getPostParams(posts);
}

export async function generateMetadata({
  params,
}: PageProps<'/blogs/tech/[slug]'>): Promise<Metadata> {
  return getPostMetadata(await findPost(params), BLOGS.tech);
}

// Reading params suspends, even for prerendered slugs, so the post streams inside Suspense. Direct
// visits still get the full prerendered HTML; client navigations show the skeleton until it arrives.
export default function TechPostPage({ params }: PageProps<'/blogs/tech/[slug]'>) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <TechPost params={params} />
    </Suspense>
  );
}

const TechPost = async ({ params }: Pick<PageProps<'/blogs/tech/[slug]'>, 'params'>) => {
  // Slugs that aren't posts are rendered on request under Cache Components; send them to 404.
  const post = await findPost(params);
  if (!post) notFound();

  const { default: Content }: MDXModule = await import(`@portfolio/content/tech/${post.slug}.mdx`);
  return (
    <Post post={post}>
      <Content components={{ img: (props) => <ContentImage {...props} images={images} /> }} />
    </Post>
  );
};
