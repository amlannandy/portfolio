import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  applyTheme,
  getOppositeTheme,
  readActiveTheme,
  readStoredTheme,
  storeTheme,
} from './theme';

const mockSystemTheme = (isDark: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches: isDark, media: query }))
  );
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('getOppositeTheme', () => {
  test('flips between light and dark', () => {
    expect(getOppositeTheme('light')).toBe('dark');
    expect(getOppositeTheme('dark')).toBe('light');
  });
});

describe('readStoredTheme', () => {
  test('returns a stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(readStoredTheme()).toBe('dark');
  });

  test('returns null when nothing or an unknown value is stored', () => {
    expect(readStoredTheme()).toBeNull();
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(readStoredTheme()).toBeNull();
  });

  test('returns null when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readStoredTheme()).toBeNull();
  });
});

describe('readActiveTheme', () => {
  test('follows the OS preference until a theme is stored', () => {
    mockSystemTheme(true);
    expect(readActiveTheme()).toBe('dark');

    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(readActiveTheme()).toBe('light');
  });

  test('falls back to light when the OS preference is unknown', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(readActiveTheme()).toBe('light');
  });
});

describe('storeTheme', () => {
  test('stores the chosen theme', () => {
    storeTheme('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  test('does not throw when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => storeTheme('dark')).not.toThrow();
  });
});

describe('applyTheme', () => {
  test('sets data-theme for a theme, and removes it for null', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    applyTheme(null);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});

describe('THEME_INIT_SCRIPT', () => {
  test('applies a stored theme and ignores unknown values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_STORAGE_KEY, '"><script>');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
