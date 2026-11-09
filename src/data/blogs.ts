import type { Blog, BlogConfig } from '@portfolio/types/post';

export const BLOGS: Record<Blog, BlogConfig> = {
  tech: {
    path: '/blogs/tech',
    emptyMessage: 'No tech writeups yet. Check back soon.',
  },
  travel: {
    path: '/blogs/travel',
    emptyMessage: 'No travel stories yet. Check back soon.',
  },
};
