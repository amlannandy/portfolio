import Timeline from '@portfolio/components/ui/Timeline';

import type { ExperienceGroup } from '@portfolio/types/experience';

import styles from './styles.module.scss';

export interface ExperienceProps {
  groups: ExperienceGroup[];
}

const Experience = ({ groups }: ExperienceProps) => (
  <div className={styles.experience}>
    {groups.map((group) => (
      <section key={group.kind} aria-labelledby={`experience-${group.kind}`}>
        <h2 className={styles.heading} id={`experience-${group.kind}`}>
          {group.heading}
        </h2>
        <Timeline roles={group.roles} />
      </section>
    ))}
  </div>
);

export default Experience;
