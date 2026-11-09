import { expect, test } from 'vitest';

import { BLOGS } from './blogs';

test('each blog lives at /blogs/<name> and has an empty-state message', () => {
  for (const [blog, config] of Object.entries(BLOGS)) {
    expect(config.path).toBe(`/blogs/${blog}`);
    expect(config.emptyMessage.trim()).not.toBe('');
  }
});
