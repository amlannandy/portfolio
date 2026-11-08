import type { NextConfig } from 'next';

import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

// Turbopack needs remark/rehype plugins as string names with serializable options.
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', ['remark-mdx-frontmatter', { name: 'frontmatter' }]],
  },
});

export default withMDX(nextConfig);
