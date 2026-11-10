import { existsSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

import { PROFILE } from './profile';

test('profile has its required text fields filled in', () => {
  for (const value of [PROFILE.name, PROFILE.initials, PROFILE.bio]) {
    expect(value.trim()).not.toBe('');
  }
});

test('the about section has paragraphs with text and well-formed links', () => {
  expect(PROFILE.about.length).toBeGreaterThan(0);
  for (const paragraph of PROFILE.about) {
    expect(paragraph.length).toBeGreaterThan(0);
    for (const part of paragraph) {
      if (typeof part === 'string') {
        expect(part.trim()).not.toBe('');
      } else {
        expect(part.text.trim()).not.toBe('');
        expect(part.href).toMatch(/^(\/|https:\/\/)\S*$/);
      }
    }
  }
});

test('the avatar photo, if set, exists in public/', () => {
  if (PROFILE.avatarUrl === undefined) return;
  expect(PROFILE.avatarUrl).toMatch(/^\/\S+\.(jpg|jpeg|png|webp|avif)$/);
  expect(existsSync(path.join(process.cwd(), 'public', PROFILE.avatarUrl))).toBe(true);
});

test('profile email and resume link are well formed', () => {
  expect(PROFILE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  expect(new URL(PROFILE.resumeUrl).protocol).toBe('https:');
});
