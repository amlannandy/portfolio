import Image from 'next/image';

import styles from './styles.module.scss';

export interface AvatarProps {
  name: string;
  /** Shown when there is no photo. */
  initials: string;
  src?: string;
  /** `sizes` for the photo; match the rendered width at each breakpoint. */
  sizes?: string;
  /** Load the photo early, for an avatar that's visible as soon as the page opens. */
  shouldPreload?: boolean;
  className?: string;
}

const Avatar = ({
  name,
  initials,
  src,
  sizes = '14rem',
  shouldPreload = false,
  className,
}: AvatarProps) => (
  <div className={[styles.avatar, className].filter(Boolean).join(' ')}>
    {src ? (
      <Image
        className={styles.photo}
        src={src}
        alt={`Photo of ${name}`}
        fill
        sizes={sizes}
        preload={shouldPreload}
      />
    ) : (
      <span className={styles.initials} role="img" aria-label={name}>
        {initials}
      </span>
    )}
  </div>
);

export default Avatar;
