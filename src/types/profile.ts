export type SocialPlatform = 'github' | 'linkedin' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  /** Shown in the avatar until a photo is added. */
  initials: string;
  role: string;
  bio: string;
  email: string;
  resumeUrl: string;
}
