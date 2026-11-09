export type Blog = 'tech' | 'travel';

/** YAML frontmatter at the top of every post (see Content and data in CLAUDE.md). */
export interface PostFrontmatter {
  title: string;
  /** ISO date string, quoted in YAML (`date: '2026-01-31'`) so it stays a string. */
  date: string;
  summary?: string;
  tags?: string[];
  draft?: boolean;
  /** Path of the cover image under `public/`, e.g. `/images/blogs/tech/my-post/cover.jpg`. */
  cover?: string;
}

export interface PostCover {
  src: string;
  /** Tiny base64 image shown blurred while the cover loads. */
  blurDataUrl: string;
}

/** What a blog's listing needs to show one post. */
export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  readingMinutes: number;
  cover?: PostCover;
}

export interface BlogConfig {
  /** Listing route; posts live at `<path>/<slug>`. */
  path: string;
  emptyMessage: string;
}
