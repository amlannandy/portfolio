// Frontmatter exported from every .mdx file by remark-mdx-frontmatter (see next.config.ts).
// Merges with the default-export typing from @types/mdx.
declare module '*.mdx' {
  export const frontmatter: {
    title: string;
    /** ISO date string, quoted in YAML (`date: '2026-01-31'`) so it stays a string. */
    date: string;
    summary?: string;
    tags?: string[];
    draft?: boolean;
  };
}
