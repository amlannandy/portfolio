import Header from '@portfolio/components/sections/Header';

import { BLOGS } from '@portfolio/data/blogs';
import { SOCIAL_LINKS } from '@portfolio/data/socials';

export default function TravelPostLayout({ children }: LayoutProps<'/blogs/travel/[slug]'>) {
  return (
    <>
      <Header
        socials={SOCIAL_LINKS}
        backLink={{ href: BLOGS.travel.path, label: BLOGS.travel.label }}
      />
      <main>{children}</main>
    </>
  );
}
