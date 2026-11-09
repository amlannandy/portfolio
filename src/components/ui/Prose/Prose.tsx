import type { ReactNode } from 'react';

import styles from './styles.module.scss';

export interface ProseProps {
  children: ReactNode;
}

/** Reading styles for rendered MDX: headings, links, lists, quotes, code and figures. */
const Prose = ({ children }: ProseProps) => <div className={styles.prose}>{children}</div>;

export default Prose;
