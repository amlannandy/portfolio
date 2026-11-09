import Image from 'next/image';
import Link from 'next/link';

import { formatPostDate } from '@portfolio/lib/date';
import type { PostSummary } from '@portfolio/types/post';

import styles from './styles.module.scss';

export interface PostListProps {
  posts: PostSummary[];
  /** Listing route the post slugs are appended to, e.g. `/blogs/tech`. */
  basePath: string;
  emptyMessage: string;
}

const PostList = ({ posts, basePath, emptyMessage }: PostListProps) => {
  if (posts.length === 0) return <p className={styles.empty}>{emptyMessage}</p>;

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.item}>
          <Link className={styles.link} href={`${basePath}/${post.slug}`}>
            {post.cover && (
              <span className={styles.cover}>
                {/* Decorative here: the link is already named by the title next to it. */}
                <Image
                  className={styles.coverImage}
                  src={post.cover.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 15rem, calc(100vw - 2rem)"
                  placeholder="blur"
                  blurDataURL={post.cover.blurDataUrl}
                />
              </span>
            )}
            <span className={styles.body}>
              <span className={styles.meta}>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time> ·{' '}
                {post.readingMinutes} min read
              </span>
              <h2 className={styles.title}>{post.title}</h2>
              {post.summary && <span className={styles.summary}>{post.summary}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
