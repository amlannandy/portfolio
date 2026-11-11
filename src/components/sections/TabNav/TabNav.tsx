'use client';

import { useEffect, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useHasScrolledPast } from '@portfolio/hooks/useHasScrolledPast';
import { isActivePath } from '@portfolio/lib/navigation';
import type { NavItem } from '@portfolio/types/navigation';

import styles from './styles.module.scss';

export interface TabNavProps {
  items: NavItem[];
  /** Id of the element that reveals the compact header; the tabs slide in with it. */
  watchId: string;
}

/** Section tabs. Each tab is a route, so this is site navigation, not an ARIA tablist. */
const TabNav = ({ items, watchId }: TabNavProps) => {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const hasMountedRef = useRef(false);
  const isStuck = useHasScrolledPast(watchId);

  // On phones the tabs scroll sideways, so the current one can sit off-screen. Centre it in the
  // strip whenever the route changes; only the strip scrolls, never the page.
  useEffect(() => {
    // Jump straight there on page load; animate only for later tab changes.
    const isPageLoad = !hasMountedRef.current;
    hasMountedRef.current = true;

    const list = listRef.current;
    const activeTab = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !activeTab) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const isFullyVisible = tabRect.left >= listRect.left && tabRect.right <= listRect.right;
    if (isFullyVisible) return;

    const shouldAnimate =
      !isPageLoad && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({
      left: list.scrollLeft + tabRect.left - listRect.left - (listRect.width - tabRect.width) / 2,
      behavior: shouldAnimate ? 'smooth' : 'instant',
    });
  }, [pathname]);

  return (
    <nav
      className={[styles.tabNav, isStuck && styles.stuck].filter(Boolean).join(' ')}
      aria-label="Sections"
    >
      <ul className={styles.list} ref={listRef}>
        {items.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                className={[styles.tab, isActive && styles.active].filter(Boolean).join(' ')}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                scroll={false}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabNav;
