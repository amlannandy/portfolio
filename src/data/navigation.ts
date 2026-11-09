import type { NavItem } from '@portfolio/types/navigation';

import { BLOGS } from './blogs';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Work Experience', href: '/' },
  { label: 'Pet Projects', href: '/projects' },
  { label: BLOGS.tech.label, href: BLOGS.tech.path },
  { label: BLOGS.travel.label, href: BLOGS.travel.path },
];
