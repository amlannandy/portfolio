import type { Blog, BlogConfig } from '@portfolio/types/post';

export const BLOGS: Record<Blog, BlogConfig> = {
  tech: {
    label: 'Tech Writeups',
    path: '/blogs/tech',
    emptyMessage: 'No tech writeups yet. Check back soon.',
  },
  travel: {
    label: 'Travel Stories',
    path: '/blogs/travel',
    emptyMessage: 'No travel stories yet. Check back soon.',
  },
};
