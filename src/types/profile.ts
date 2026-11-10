export type SocialPlatform = 'github' | 'linkedin' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

/** Part of a paragraph that links somewhere. */
export interface TextLink {
  text: string;
  /** Site path starting with `/`, or a full URL. */
  href: string;
}

/** A paragraph made of plain text runs and links, in reading order. */
export type RichParagraph = (string | TextLink)[];

export interface Profile {
  name: string;
  /** Shown in the avatar when there is no photo. */
  initials: string;
  /** Square photo under `public/`, e.g. `/images/profile/portrait.webp`. */
  avatarUrl?: string;
  bio: string;
  /** Paragraphs shown above the experience timelines. */
  about: RichParagraph[];
  email: string;
  /** Full URL of the hosted résumé, opened in a new tab. */
  resumeUrl: string;
}
