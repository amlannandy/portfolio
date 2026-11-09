'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isActivePath } from '@portfolio/lib/navigation';
import type { NavItem } from '@portfolio/types/navigation';

import styles from './styles.module.scss';

export interface TabNavProps {
  items: NavItem[];
}

/** Section tabs. Each tab is a route, so this is site navigation, not an ARIA tablist. */
const TabNav = ({ items }: TabNavProps) => {
  const pathname = usePathname();

  return (
    <nav className={styles.tabNav} aria-label="Sections">
      <ul className={styles.list}>
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
