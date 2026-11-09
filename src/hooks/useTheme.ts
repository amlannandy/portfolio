import { useLayoutEffect, useSyncExternalStore } from 'react';

import {
  DARK_SCHEME_QUERY,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  applyTheme,
  readActiveTheme,
  readStoredTheme,
  storeTheme,
} from '@portfolio/lib/theme';
import type { Theme } from '@portfolio/types/theme';

interface UseThemeResult {
  /** The theme on screen; `null` during server render and hydration, before it is known. */
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}

const subscribe = (onChange: () => void): (() => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      applyTheme(readStoredTheme());
      onChange();
    }
  };
  // Without a saved choice the OS preference decides, so follow it changing too.
  const darkScheme =
    typeof window.matchMedia === 'function' ? window.matchMedia(DARK_SCHEME_QUERY) : null;

  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener('storage', handleStorage);
  darkScheme?.addEventListener('change', onChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', handleStorage);
    darkScheme?.removeEventListener('change', onChange);
  };
};

const getServerSnapshot = (): null => null;

const setTheme = (theme: Theme): void => {
  storeTheme(theme);
  applyTheme(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

export const useTheme = (): UseThemeResult => {
  const theme = useSyncExternalStore(subscribe, readActiveTheme, getServerSnapshot);

  // The inline head script sets `data-theme` before paint, but React's dev Strict Mode remount
  // clears attributes on <html>. Re-apply before paint; a no-op in production.
  useLayoutEffect(() => {
    applyTheme(readStoredTheme());
  }, []);

  return { theme, setTheme };
};
