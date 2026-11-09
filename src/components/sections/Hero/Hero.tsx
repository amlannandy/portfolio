import Avatar from '@portfolio/components/ui/Avatar';
import ButtonLink from '@portfolio/components/ui/ButtonLink';
import Icon from '@portfolio/components/ui/Icon';
import SocialLinks from '@portfolio/components/ui/SocialLinks';

import type { Profile, SocialLink } from '@portfolio/types/profile';

import styles from './styles.module.scss';

export interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
  /** Id on the element that ends the hero, so the compact header knows when it has scrolled away. */
  endMarkerId?: string;
}

const Hero = ({ profile, socials, endMarkerId }: HeroProps) => (
  <section className={styles.hero} aria-labelledby="hero-name">
    <Avatar
      className={styles.avatar}
      name={profile.name}
      initials={profile.initials}
      src={profile.avatarUrl}
      shouldPreload
      sizes="(min-width: 768px) 14rem, 8rem"
    />
    <div className={styles.intro}>
      <h1 className={styles.name} id="hero-name">
        {profile.name}
      </h1>
      <p className={styles.bio}>{profile.bio}</p>
      <div className={styles.actions}>
        <ButtonLink className={styles.resume} href={profile.resumeUrl} download>
          <Icon name="download" size={18} />
          View resume
        </ButtonLink>
        <ButtonLink className={styles.email} variant="ghost" href={`mailto:${profile.email}`}>
          {profile.email}
        </ButtonLink>
      </div>
      {/* On wider screens the social links sit in the header instead. */}
      <nav className={styles.socials} aria-label="Social links" id={endMarkerId}>
        <SocialLinks links={socials} />
      </nav>
    </div>
  </section>
);

export default Hero;
