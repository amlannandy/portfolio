import SocialLinks from '@portfolio/components/ui/SocialLinks';
import ThemeToggle from '@portfolio/components/ui/ThemeToggle';

import type { SocialLink } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface HeaderProps {
  socials: SocialLink[];
}

const Header = ({ socials }: HeaderProps) => (
  <header className={styles.header}>
    <ThemeToggle />
    {/* On phones the social links sit in the hero instead. */}
    <nav className={styles.socials} aria-label="Social links">
      <SocialLinks links={socials} />
    </nav>
  </header>
);

export default Header;
