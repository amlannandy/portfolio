// Frontmatter exported from every .mdx file by remark-mdx-frontmatter (see next.config.ts).
// Merges with the default-export typing from @types/mdx.
declare module '*.mdx' {
  import type { PostFrontmatter } from '@portfolio/types/post';

  export const frontmatter: PostFrontmatter;
}
