import Link from 'next/link';

import Icon from '@portfolio/components/ui/Icon';
import SocialLinks from '@portfolio/components/ui/SocialLinks';
import ThemeToggle from '@portfolio/components/ui/ThemeToggle';

import type { SocialLink } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface HeaderProps {
  socials: SocialLink[];
  /** Shown on the left, e.g. from a post back to its blog. */
  backLink?: {
    href: string;
    label: string;
  };
}

const Header = ({ socials, backLink }: HeaderProps) => (
  <header className={styles.header}>
    {backLink && (
      <Link className={styles.backLink} href={backLink.href}>
        <Icon name="arrowLeft" size={18} />
        {backLink.label}
      </Link>
    )}
    <div className={styles.actions}>
      <ThemeToggle />
      {/* On phones the social links sit in the hero instead. */}
      <nav className={styles.socials} aria-label="Social links">
        <SocialLinks links={socials} />
      </nav>
    </div>
  </header>
);

export default Header;
