import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import type { PostSummary } from '@portfolio/types/post';

import PostList from './PostList';

const POSTS: PostSummary[] = [
  {
    slug: 'hello-world',
    title: 'Hello world',
    date: '2026-01-31',
    summary: 'First post.',
    readingMinutes: 3,
  },
  { slug: 'second-post', title: 'Second post', date: '2026-01-15', readingMinutes: 1 },
];

afterEach(cleanup);

test('links each post under the blog path with its date and reading time', () => {
  render(<PostList posts={POSTS} basePath="/blogs/tech" emptyMessage="No posts yet." />);

  const link = screen.getByRole('link', { name: /Hello world/ });
  expect(link.getAttribute('href')).toBe('/blogs/tech/hello-world');
  expect(link.textContent).toContain('31 Jan 2026 · 3 min read');
  expect(screen.getByRole('heading', { name: 'Second post' })).toBeDefined();
  expect(screen.queryByText('No posts yet.')).toBeNull();
});

test('shows the empty message when there are no posts', () => {
  render(<PostList posts={[]} basePath="/blogs/tech" emptyMessage="No posts yet." />);

  expect(screen.getByText('No posts yet.')).toBeDefined();
  expect(screen.queryByRole('list')).toBeNull();
});
