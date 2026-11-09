'use client';

import Icon from '@portfolio/components/ui/Icon';
import type { IconName } from '@portfolio/components/ui/Icon';

import { useTheme } from '@portfolio/hooks/useTheme';
import { getOppositeTheme } from '@portfolio/lib/theme';
import type { Theme } from '@portfolio/types/theme';

import styles from './styles.module.scss';

export interface ThemeToggleProps {
  className?: string;
}

const THEME_ICONS: Record<Theme, IconName> = {
  light: 'sun',
  dark: 'moon',
};

/** Switches between light and dark. The icon shows the theme it switches to. */
const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const classNames = [styles.toggle, className].filter(Boolean).join(' ');

  // The active theme is unknown until mounted; keep the space without theme-dependent markup.
  if (theme === null) return <span className={classNames} aria-hidden="true" />;

  const nextTheme = getOppositeTheme(theme);
  const handleClick = () => setTheme(nextTheme);

  return (
    <button
      type="button"
      className={classNames}
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={handleClick}
    >
      <Icon name={THEME_ICONS[nextTheme]} />
    </button>
  );
};

export default ThemeToggle;
