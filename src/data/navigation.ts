import type { NavItem } from '@portfolio/types/navigation';

import { BLOGS } from './blogs';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/' },
  // Pet Projects (`/projects`) stays out of the tabs until it has content.
  { label: BLOGS.tech.label, href: BLOGS.tech.path },
  { label: BLOGS.travel.label, href: BLOGS.travel.path },
];
