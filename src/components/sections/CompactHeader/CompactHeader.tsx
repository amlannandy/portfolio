'use client';

import { useEffect, useState } from 'react';

import Icon from '@portfolio/components/ui/Icon';
import SocialLinks from '@portfolio/components/ui/SocialLinks';
import ThemeToggle from '@portfolio/components/ui/ThemeToggle';

import type { SocialLink } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface CompactHeaderProps {
  name: string;
  resumeUrl: string;
  socials: SocialLink[];
  /** Id of the element whose passing under this bar reveals it (the end of the hero). */
  watchId: string;
}

/**
 * Phone-only bar that slides in once the hero's actions scroll out of view, keeping the name,
 * résumé and social links reachable. Hidden from wider screens in CSS.
 */
const CompactHeader = ({ name, resumeUrl, socials, watchId }: CompactHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;

    const barHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--compact-header-height')
    );
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // The observed area starts just below where the bar sits. Show the bar once the target has
        // left that area through its top edge (scrolled up under the bar), not while it is still
        // below the fold. Compare against the area's top, not the viewport's: the observer only
        // fires as the target crosses that edge, when it is still on screen.
        const areaTop = entry.rootBounds?.top ?? 0;
        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < areaTop);
      },
      { rootMargin: `-${barHeight * rootFontSize}px 0px 0px 0px` }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div className={styles.compactHeader} hidden={!isVisible}>
      <div className={styles.row}>
        <p className={styles.name}>{name}</p>
        <ThemeToggle />
      </div>
      <nav className={styles.row} aria-label="Quick links">
        <a
          className={styles.resume}
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View résumé"
        >
          <Icon name="download" size={18} />
        </a>
        <SocialLinks links={socials} />
      </nav>
    </div>
  );
};

export default CompactHeader;
