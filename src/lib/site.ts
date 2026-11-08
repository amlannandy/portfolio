export const SITE_NAME = 'Amlan Kumar Nandy | Profile';

export const SITE_DESCRIPTION =
  'Portfolio of Amlan Kumar Nandy, a Full Stack Engineer working at Postman.';

// Canonical origin of the site, set per environment (see Deployment in CLAUDE.md).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error('NEXT_PUBLIC_SITE_URL is not set. Add it to .env.local or the host settings.');
}

export const SITE_URL = siteUrl;
