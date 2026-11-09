import { expect, test } from 'vitest';

import { NAV_ITEMS } from './navigation';

test('nav items have labels and unique, root-relative kebab-case paths', () => {
  const hrefs = NAV_ITEMS.map((item) => item.href);
  expect(new Set(hrefs).size).toBe(hrefs.length);

  for (const item of NAV_ITEMS) {
    expect(item.label.trim()).not.toBe('');
    expect(item.href).toMatch(/^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/);
  }
});

test('the blogs live at their documented routes', () => {
  expect(NAV_ITEMS.map((item) => item.href)).toEqual(
    expect.arrayContaining(['/blogs/tech', '/blogs/travel'])
  );
});
