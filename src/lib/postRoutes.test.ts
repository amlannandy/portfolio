import { describe, expect, test } from 'vitest';

import type { BlogConfig, PostSummary } from '@portfolio/types/post';

import { NO_POSTS_SLUG, getPostMetadata, getPostParams } from './postRoutes';

const BLOG: BlogConfig = { label: 'Tech Writeups', path: '/blogs/tech', emptyMessage: 'None.' };
const POST: PostSummary = {
  slug: 'hello-world',
  title: 'Hello world',
  date: '2026-01-31',
  summary: 'First post.',
  readingMinutes: 2,
};

describe('getPostParams', () => {
  test('returns one param per post', () => {
    expect(getPostParams([POST])).toEqual([{ slug: 'hello-world' }]);
  });

  test('returns a placeholder that cannot match a post when there are none', () => {
    expect(getPostParams([])).toEqual([{ slug: NO_POSTS_SLUG }]);
    expect(NO_POSTS_SLUG).not.toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
});

describe('getPostMetadata', () => {
  test('uses the frontmatter and a relative canonical URL', () => {
    expect(getPostMetadata(POST, BLOG)).toMatchObject({
      title: 'Hello world',
      description: 'First post.',
      alternates: { canonical: '/blogs/tech/hello-world' },
      openGraph: { type: 'article', publishedTime: '2026-01-31' },
    });
  });

  test('shares the cover as the Open Graph image', () => {
    const cover = { src: '/images/blogs/tech/hello-world/cover.jpg', width: 800, height: 450 };
    const metadata = getPostMetadata(
      { ...POST, cover: { ...cover, blurDataUrl: '', isAnimated: false } },
      BLOG
    );
    expect(metadata.openGraph).toMatchObject({ images: [{ url: cover.src, width: 800 }] });
  });

  test('is empty for an unknown post', () => {
    expect(getPostMetadata(undefined, BLOG)).toEqual({});
  });
});
