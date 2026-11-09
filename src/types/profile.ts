export type SocialPlatform = 'github' | 'linkedin' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  /** Shown in the avatar when there is no photo. */
  initials: string;
  /** Square photo under `public/`, e.g. `/images/profile/portrait.webp`. */
  avatarUrl?: string;
  bio: string;
  email: string;
  resumeUrl: string;
}
