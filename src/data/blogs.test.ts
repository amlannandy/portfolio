import { expect, test } from 'vitest';

import { BLOGS } from './blogs';

test('each blog lives at /blogs/<name> and has a label and an empty-state message', () => {
  for (const [blog, config] of Object.entries(BLOGS)) {
    expect(config.path).toBe(`/blogs/${blog}`);
    expect(config.label.trim()).not.toBe('');
    expect(config.emptyMessage.trim()).not.toBe('');
  }
});
