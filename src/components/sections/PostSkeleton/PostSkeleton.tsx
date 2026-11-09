import styles from './styles.module.scss';

/** Placeholder with the post page's shape, shown while a post streams in. */
const PostSkeleton = () => (
  <div className={styles.skeleton} aria-busy="true" aria-label="Loading post">
    <span className={styles.meta} />
    <span className={styles.title} />
    <span className={styles.cover} />
    <span className={styles.line} />
    <span className={styles.line} />
    <span className={styles.shortLine} />
  </div>
);

export default PostSkeleton;
