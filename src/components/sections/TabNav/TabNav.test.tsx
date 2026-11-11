import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import type { NavItem } from '@portfolio/types/navigation';

import TabNav from './TabNav';

const mockPathname = vi.hoisted(() => ({ current: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname.current,
}));

const ITEMS: NavItem[] = [
  { label: 'Experience', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Tech blog', href: '/blogs/tech' },
];

afterEach(cleanup);

test('links every section and marks the current route', () => {
  mockPathname.current = '/projects';
  render(<TabNav items={ITEMS} watchId="hero-end" />);

  const nav = screen.getByRole('navigation', { name: 'Sections' });
  expect(nav).toBeDefined();
  expect(screen.getByRole('link', { name: 'Experience' }).getAttribute('href')).toBe('/');
  expect(screen.getByRole('link', { name: 'Projects' }).getAttribute('aria-current')).toBe('page');
  expect(screen.getByRole('link', { name: 'Experience' }).hasAttribute('aria-current')).toBe(false);
});

test('keeps a blog tab current on its post pages', () => {
  mockPathname.current = '/blogs/tech/my-first-post';
  render(<TabNav items={ITEMS} watchId="hero-end" />);

  expect(screen.getByRole('link', { name: 'Tech blog' }).getAttribute('aria-current')).toBe('page');
});
