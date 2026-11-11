import CompactHeader from '@portfolio/components/sections/CompactHeader';
import Header from '@portfolio/components/sections/Header';
import Hero from '@portfolio/components/sections/Hero';
import TabNav from '@portfolio/components/sections/TabNav';

import { NAV_ITEMS } from '@portfolio/data/navigation';
import { PROFILE } from '@portfolio/data/profile';
import { SOCIAL_LINKS } from '@portfolio/data/socials';

import styles from './layout.module.scss';

const HERO_END_ID = 'hero-end';

export default function ProfileLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header socials={SOCIAL_LINKS} />
      <CompactHeader profile={PROFILE} socials={SOCIAL_LINKS} watchId={HERO_END_ID} />
      <Hero profile={PROFILE} socials={SOCIAL_LINKS} endMarkerId={HERO_END_ID} />
      <TabNav items={NAV_ITEMS} watchId={HERO_END_ID} />
      <main className={styles.main}>{children}</main>
    </>
  );
}
