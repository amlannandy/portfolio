import type { ComponentPropsWithoutRef } from 'react';

import Image from 'next/image';

import type { ImageInfo } from '@portfolio/types/post';

import styles from './styles.module.scss';

export interface ContentImageProps extends ComponentPropsWithoutRef<'img'> {
  /** Sizes and blur placeholders of the blog's images, keyed by public path. */
  images: Record<string, ImageInfo>;
}

/** A markdown image in a post, rendered with `next/image` at its natural size. */
const ContentImage = ({ src, alt = '', images }: ContentImageProps) => {
  const image = typeof src === 'string' ? images[src] : undefined;
  if (!image) {
    // Fails the build rather than shipping a broken image.
    throw new Error(`Post image "${String(src)}" was not found under public/images/blogs/.`);
  }

  return (
    <Image
      className={styles.image}
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes="(min-width: 768px) 42rem, calc(100vw - 2rem)"
      placeholder="blur"
      blurDataURL={image.blurDataUrl}
      unoptimized={image.isAnimated}
    />
  );
};

export default ContentImage;
