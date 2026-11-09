import type { ComponentPropsWithoutRef } from 'react';

import styles from './styles.module.scss';

export interface ButtonLinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?: 'primary' | 'ghost';
}

/** A link styled as a pill button, for actions that go somewhere (download, mailto, page). */
const ButtonLink = ({ variant = 'primary', className, ...rest }: ButtonLinkProps) => (
  <a
    className={[styles.buttonLink, styles[variant], className].filter(Boolean).join(' ')}
    {...rest}
  />
);

export default ButtonLink;
