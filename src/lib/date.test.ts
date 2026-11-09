import { expect, test } from 'vitest';

import { formatPostDate } from './date';

test('formats a post date as day, short month and year', () => {
  expect(formatPostDate('2026-01-31')).toBe('31 Jan 2026');
});

test('keeps the calendar date whatever the time zone', () => {
  expect(formatPostDate('2026-03-01')).toBe('1 Mar 2026');
});
