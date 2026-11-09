import type { NavItem } from '@portfolio/types/navigation';

import { BLOGS } from './blogs';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Work Experience', href: '/' },
  { label: 'Pet Projects', href: '/projects' },
  { label: 'Tech Writeups', href: BLOGS.tech.path },
  { label: 'Travel Stories', href: BLOGS.travel.path },
];
