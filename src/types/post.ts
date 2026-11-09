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

export interface ImageInfo {
  /** Public path, e.g. `/images/blogs/tech/my-post/cover.jpg`. */
  src: string;
  width: number;
  height: number;
  /** Tiny base64 image shown blurred while the image loads. */
  blurDataUrl: string;
  /** Animated GIFs and WebPs can't be resized by `next/image`, so they're served as they are. */
  isAnimated: boolean;
}

/** What a blog's listing needs to show one post. */
export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  readingMinutes: number;
  cover?: ImageInfo;
}

export interface BlogConfig {
  /** Name used for its tab and back links. */
  label: string;
  /** Listing route; posts live at `<path>/<slug>`. */
  path: string;
  emptyMessage: string;
}
