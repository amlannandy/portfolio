import type { ReactNode } from 'react';

import Image from 'next/image';

import PostMeta from '@portfolio/components/ui/PostMeta';
import Prose from '@portfolio/components/ui/Prose';

import type { PostSummary } from '@portfolio/types/post';

import styles from './styles.module.scss';

export interface PostProps {
  post: PostSummary;
  /** The rendered MDX body. */
  children: ReactNode;
}

const Post = ({ post, children }: PostProps) => (
  <article className={styles.post}>
    <header className={styles.header}>
      <PostMeta className={styles.meta} date={post.date} readingMinutes={post.readingMinutes} />
      <h1 className={styles.title}>{post.title}</h1>
    </header>
    {post.cover && (
      // Decorative: the title above already says what the post is.
      <Image
        className={styles.cover}
        src={post.cover.src}
        alt=""
        width={post.cover.width}
        height={post.cover.height}
        sizes="(min-width: 768px) 42rem, calc(100vw - 2rem)"
        placeholder="blur"
        blurDataURL={post.cover.blurDataUrl}
        unoptimized={post.cover.isAnimated}
        preload
      />
    )}
    <Prose>{children}</Prose>
  </article>
);

export default Post;
