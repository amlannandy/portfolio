import { describe, expect, test } from 'vitest';

import { isActivePath } from './navigation';

describe('isActivePath', () => {
  test('root matches only itself', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/projects', '/')).toBe(false);
  });

  test('a section matches itself and its child routes', () => {
    expect(isActivePath('/blogs/tech', '/blogs/tech')).toBe(true);
    expect(isActivePath('/blogs/tech/my-first-post', '/blogs/tech')).toBe(true);
  });

  test('a section does not match a sibling that shares its prefix', () => {
    expect(isActivePath('/blogs/technology', '/blogs/tech')).toBe(false);
    expect(isActivePath('/blogs/travel', '/blogs/tech')).toBe(false);
  });
});
