import type { Theme } from '@portfolio/types/theme';

export const THEME_STORAGE_KEY = 'theme';

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** Event fired on `window` when the theme changes in this tab (`storage` only covers other tabs). */
export const THEME_CHANGE_EVENT = 'themechange';

/**
 * Runs in `<head>` before first paint to apply a stored light/dark choice. Kept dependency-free
 * and in sync with `readStoredTheme` / `applyTheme` below.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

export const getOppositeTheme = (theme: Theme): Theme => (theme === 'dark' ? 'light' : 'dark');

/** The visitor's saved choice, or `null` when they haven't picked one and the OS decides. */
export const readStoredTheme = (): Theme | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const getSystemTheme = (): Theme =>
  typeof window.matchMedia === 'function' && window.matchMedia(DARK_SCHEME_QUERY).matches
    ? 'dark'
    : 'light';

/** The theme currently on screen: the saved choice, else the OS preference. */
export const readActiveTheme = (): Theme => readStoredTheme() ?? getSystemTheme();

export const storeTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the choice lasts this visit.
  }
};

/** Pass `null` to drop the override and follow the OS preference. */
export const applyTheme = (theme: Theme | null): void => {
  const root = document.documentElement;
  if (theme) root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
};
