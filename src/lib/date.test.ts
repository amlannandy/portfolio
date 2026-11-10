import { expect, test } from 'vitest';

import { formatMonth, formatPostDate } from './date';

test('formats a post date as day, short month and year', () => {
  expect(formatPostDate('2026-01-31')).toBe('31 Jan 2026');
});

test('keeps the calendar date whatever the time zone', () => {
  expect(formatPostDate('2026-03-01')).toBe('1 Mar 2026');
});

test('formats a month as short month and year', () => {
  expect(formatMonth('2024-01')).toBe('Jan 2024');
});
