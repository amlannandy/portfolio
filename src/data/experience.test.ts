import { expect, test } from 'vitest';

import { EXPERIENCE } from './experience';

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

test('each kind of experience appears once and has roles', () => {
  const kinds = EXPERIENCE.map((group) => group.kind);
  expect(new Set(kinds).size).toBe(kinds.length);
  for (const group of EXPERIENCE) {
    expect(group.heading.trim()).not.toBe('');
    expect(group.roles.length).toBeGreaterThan(0);
  }
});

test('every role has a title, an organization and well-formed months', () => {
  for (const role of EXPERIENCE.flatMap((group) => group.roles)) {
    expect(role.title.trim()).not.toBe('');
    expect(role.organization.trim()).not.toBe('');
    expect(role.start).toMatch(MONTH);
    if (role.end) {
      expect(role.end).toMatch(MONTH);
      expect(role.end >= role.start).toBe(true);
    }
  }
});

test('roles are listed newest first', () => {
  for (const group of EXPERIENCE) {
    const starts = group.roles.map((role) => role.start);
    expect(starts).toEqual(starts.toSorted().reverse());
  }
});
