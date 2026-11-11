'use client';

import Avatar from '@portfolio/components/ui/Avatar';
import Icon from '@portfolio/components/ui/Icon';
import SocialLinks from '@portfolio/components/ui/SocialLinks';
import ThemeToggle from '@portfolio/components/ui/ThemeToggle';

import { useHasScrolledPast } from '@portfolio/hooks/useHasScrolledPast';
import type { Profile, SocialLink } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface CompactHeaderProps {
  profile: Profile;
  socials: SocialLink[];
  /** Id of the element whose passing under this bar reveals it (the end of the hero). */
  watchId: string;
}

/**
 * Phone-only bar that slides in once the hero's actions scroll out of view, keeping the avatar,
 * résumé, social links and theme toggle reachable on one line. Hidden from wider screens in CSS.
 */
const CompactHeader = ({ profile, socials, watchId }: CompactHeaderProps) => {
  const isVisible = useHasScrolledPast(watchId);

  return (
    <div className={styles.compactHeader} hidden={!isVisible}>
      <Avatar
        className={styles.avatar}
        name={profile.name}
        initials={profile.initials}
        src={profile.avatarUrl}
        sizes="2.75rem"
      />
      <div className={styles.actions}>
        <nav className={styles.quickLinks} aria-label="Quick links">
          <a
            className={styles.resume}
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View résumé"
          >
            <Icon name="download" size={18} />
          </a>
          <SocialLinks className={styles.socials} links={socials} />
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CompactHeader;
