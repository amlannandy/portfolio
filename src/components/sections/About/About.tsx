import ContentLink from '@portfolio/components/ui/ContentLink';

import type { RichParagraph } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface AboutProps {
  paragraphs: RichParagraph[];
}

// The paragraphs are fixed content that never reorders, so their positions make stable keys.
const About = ({ paragraphs }: AboutProps) => (
  <section className={styles.about} aria-label="About me">
    {paragraphs.map((paragraph, paragraphIndex) => (
      <p key={paragraphIndex} className={styles.text}>
        {paragraph.map((part, partIndex) =>
          typeof part === 'string' ? (
            part
          ) : (
            <ContentLink key={partIndex} className={styles.link} href={part.href}>
              {part.text}
            </ContentLink>
          )
        )}
      </p>
    ))}
  </section>
);

export default About;
