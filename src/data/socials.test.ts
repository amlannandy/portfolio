import { expect, test } from 'vitest';

import { SOCIAL_LINKS } from './socials';

test('each platform appears once', () => {
  const platforms = SOCIAL_LINKS.map((link) => link.platform);
  expect(new Set(platforms).size).toBe(platforms.length);
});

test('every link has a label and a well-formed URL', () => {
  for (const link of SOCIAL_LINKS) {
    expect(link.label.trim()).not.toBe('');
    const url = new URL(link.href);
    expect(link.platform === 'email' ? 'mailto:' : 'https:').toBe(url.protocol);
  }
});
