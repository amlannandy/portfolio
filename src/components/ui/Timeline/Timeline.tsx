import { formatMonth } from '@portfolio/lib/date';
import type { Role } from '@portfolio/types/experience';

import styles from './styles.module.scss';

export interface TimelineProps {
  /** Newest first. */
  roles: Role[];
}

const Timeline = ({ roles }: TimelineProps) => (
  <ol className={styles.timeline}>
    {roles.map((role) => (
      <li
        key={`${role.organization}-${role.start}`}
        className={[styles.item, !role.end && styles.current].filter(Boolean).join(' ')}
      >
        <h3 className={styles.title}>{role.title}</h3>
        <p className={styles.organization}>{role.organization}</p>
        <p className={styles.dates}>
          <time dateTime={role.start}>{formatMonth(role.start)}</time> –{' '}
          {role.end ? <time dateTime={role.end}>{formatMonth(role.end)}</time> : 'Present'}
        </p>
      </li>
    ))}
  </ol>
);

export default Timeline;
