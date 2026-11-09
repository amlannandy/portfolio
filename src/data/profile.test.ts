import { expect, test } from 'vitest';

import { PROFILE } from './profile';

test('profile has its required text fields filled in', () => {
  for (const value of [PROFILE.name, PROFILE.initials, PROFILE.role, PROFILE.bio]) {
    expect(value.trim()).not.toBe('');
  }
});

test('profile email and résumé link are well formed', () => {
  expect(PROFILE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  expect(PROFILE.resumeUrl).toMatch(/^\/\S+\.pdf$/);
});
