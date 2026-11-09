import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { THEME_STORAGE_KEY } from '@portfolio/lib/theme';

import ThemeToggle from './ThemeToggle';

const mockSystemTheme = (isDark: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: isDark,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('switches between light and dark, applying and storing each choice', async () => {
  mockSystemTheme(false);
  const user = userEvent.setup();
  render(<ThemeToggle />);

  const toggle = await screen.findByRole('button', { name: 'Switch to dark mode' });

  await user.click(toggle);
  expect(toggle.getAttribute('aria-label')).toBe('Switch to light mode');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

  await user.click(toggle);
  expect(toggle.getAttribute('aria-label')).toBe('Switch to dark mode');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
});

test('starts from the OS preference when nothing is stored', async () => {
  mockSystemTheme(true);
  render(<ThemeToggle />);

  expect(await screen.findByRole('button', { name: 'Switch to light mode' })).toBeDefined();
  expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
});

test('a stored theme wins over the OS preference', async () => {
  mockSystemTheme(true);
  localStorage.setItem(THEME_STORAGE_KEY, 'light');
  render(<ThemeToggle />);

  expect(await screen.findByRole('button', { name: 'Switch to dark mode' })).toBeDefined();
});

test('keeps every toggle on the page in sync', async () => {
  mockSystemTheme(false);
  const user = userEvent.setup();
  render(
    <>
      <ThemeToggle />
      <ThemeToggle />
    </>
  );

  const [first] = await screen.findAllByRole('button', { name: 'Switch to dark mode' });
  await user.click(first);

  expect(screen.getAllByRole('button', { name: 'Switch to light mode' })).toHaveLength(2);
});
