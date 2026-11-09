import type { SocialLink } from '@portfolio/types/profile';

import { PROFILE } from './profile';

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'github', label: 'GitHub', href: 'https://github.com/amlannandy' },
  { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/amlan-nandy/' },
  { platform: 'email', label: 'Email', href: `mailto:${PROFILE.email}` },
];
