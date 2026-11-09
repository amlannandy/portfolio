import Icon from '@portfolio/components/ui/Icon';
import type { IconName } from '@portfolio/components/ui/Icon';

import type { SocialLink, SocialPlatform } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

const PLATFORM_ICONS: Record<SocialPlatform, IconName> = {
  github: 'github',
  linkedin: 'linkedin',
  email: 'mail',
};

const isExternal = (href: string): boolean => href.startsWith('http');

const SocialLinks = ({ links, className }: SocialLinksProps) => (
  <ul className={[styles.list, className].filter(Boolean).join(' ')}>
    {links.map((link) => (
      <li key={link.platform}>
        <a
          className={styles.link}
          href={link.href}
          aria-label={link.label}
          {...(isExternal(link.href) && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          <Icon name={PLATFORM_ICONS[link.platform]} />
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
