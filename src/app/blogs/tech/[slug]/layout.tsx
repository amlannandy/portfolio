import Header from '@portfolio/components/sections/Header';

import { BLOGS } from '@portfolio/data/blogs';
import { SOCIAL_LINKS } from '@portfolio/data/socials';

export default function TechPostLayout({ children }: LayoutProps<'/blogs/tech/[slug]'>) {
  return (
    <>
      <Header
        socials={SOCIAL_LINKS}
        backLink={{ href: BLOGS.tech.path, label: BLOGS.tech.label }}
      />
      <main>{children}</main>
    </>
  );
}
