/**
 * Whether a nav item should show as current. The root only matches itself; other items also
 * match their child routes, so a post under `/blogs/tech/...` keeps the Tech blog tab active.
 */
export const isActivePath = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};
