const POST_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  // Post dates are calendar dates, so format them the same wherever the code runs.
  timeZone: 'UTC',
});

/** Formats a `YYYY-MM-DD` post date for display, e.g. `31 Jan 2026`. */
export const formatPostDate = (date: string): string =>
  POST_DATE_FORMAT.format(new Date(`${date}T00:00:00Z`));
