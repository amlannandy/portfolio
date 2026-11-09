import type { ReactNode } from 'react';

export type IconName = 'arrowLeft' | 'github' | 'linkedin' | 'mail' | 'sun' | 'moon' | 'download';

export interface IconProps {
  name: IconName;
  /** Rendered size in px; icons are square. */
  size?: number;
  className?: string;
}

// 24x24 stroke icons, drawn with `currentColor` so they follow the surrounding text color.
const PATHS: Record<IconName, ReactNode> = {
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
};

/** Decorative icon. Give the surrounding control an accessible name. */
const Icon = ({ name, size = 20, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {PATHS[name]}
  </svg>
);

export default Icon;
