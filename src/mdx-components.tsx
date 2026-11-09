import type { MDXComponents } from 'mdx/types';

import ContentLink from '@portfolio/components/ui/ContentLink';

// Images are mapped per page instead, since they need that blog's image sizes (see the post routes).
const components: MDXComponents = {
  a: ContentLink,
};

export const useMDXComponents = (): MDXComponents => components;
