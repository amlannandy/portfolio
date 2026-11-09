import type { ComponentPropsWithoutRef } from 'react';

import Link from 'next/link';

export type ContentLinkProps = ComponentPropsWithoutRef<'a'>;

/** A markdown link in a post: site links navigate client-side, others are plain links. */
const ContentLink = ({ href = '', ...rest }: ContentLinkProps) =>
  href.startsWith('/') ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;

export default ContentLink;
