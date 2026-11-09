import type { Metadata } from 'next';

import type { BlogConfig, PostSummary } from '@portfolio/types/post';

/**
 * Prerendered when a blog has no posts yet. Cache Components needs at least one param, and this
 * slug can never match a post (slugs are kebab-case), so it renders the 404 page.
 */
export const NO_POSTS_SLUG = '_no-posts';

export interface PostParams {
  slug: string;
}

export const getPostParams = (posts: PostSummary[]): PostParams[] =>
  posts.length > 0 ? posts.map(({ slug }) => ({ slug })) : [{ slug: NO_POSTS_SLUG }];

export const getPostMetadata = (post: PostSummary | undefined, blog: BlogConfig): Metadata => {
  if (!post) return {};
  const url = `${blog.path}/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      ...(post.cover && {
        images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height }],
      }),
    },
  };
};
