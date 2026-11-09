import { expect, test } from '@playwright/test';

import { BLOGS } from '../src/data/blogs';
import { NAV_ITEMS } from '../src/data/navigation';

// Tab labels come from the data, so renaming a tab doesn't break these tests.
const TABS = NAV_ITEMS.map((item) => ({ name: item.label, path: item.href }));

for (const tab of TABS) {
  test(`${tab.name} loads without console errors or horizontal scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto(tab.path);

    await expect(page.getByRole('heading', { level: 1, name: 'Amlan Kumar Nandy' })).toBeVisible();
    await expect(page.getByRole('link', { name: tab.name })).toHaveAttribute(
      'aria-current',
      'page'
    );

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
    expect(errors).toEqual([]);
  });
}

test('tabs navigate between sections', async ({ page }) => {
  await page.goto('/');
  const sections = page.getByRole('navigation', { name: 'Sections' });

  for (const tab of [...TABS.slice(1), TABS[0]]) {
    await sections.getByRole('link', { name: tab.name }).click();
    await expect(page).toHaveURL(tab.path);
    await expect(sections.getByRole('link', { name: tab.name })).toHaveAttribute(
      'aria-current',
      'page'
    );
  }
});

test('the theme follows the OS until the visitor picks one, which survives a reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');

  await expect(html).not.toHaveAttribute('data-theme');
  await page.getByRole('button', { name: 'Switch to light mode' }).first().click();
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Switch to dark mode' }).first()).toBeVisible();
});

test('on phones, a compact header appears once the hero scrolls away', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The compact header is phone-only.');
  await page.goto('/');
  const quickLinks = page.getByRole('navigation', { name: 'Quick links' });

  await expect(quickLinks).toBeHidden();
  await page.getByRole('navigation', { name: 'Sections' }).evaluate((element) => {
    // Make the page tall enough to scroll the hero away while sections are still empty.
    document.body.style.minHeight = '300vh';
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY);
  });

  await expect(quickLinks).toBeVisible();
  await expect(quickLinks.getByRole('link', { name: 'Download résumé' })).toBeVisible();
});

test('the tech blog lists its posts, newest first', async ({ page }) => {
  await page.goto(BLOGS.tech.path);
  const posts = page.getByRole('main').getByRole('listitem');

  await expect(posts.first()).toBeVisible();
  await expect(page.getByText(BLOGS.tech.emptyMessage)).toBeHidden();
  const dates = await posts
    .locator('time')
    .evaluateAll((times) => times.map((time) => time.getAttribute('datetime') ?? ''));
  expect(dates).toEqual([...dates].sort().reverse());
});

test('a blog without posts shows its empty state', async ({ page }) => {
  await page.goto(BLOGS.travel.path);
  await expect(page.getByText(BLOGS.travel.emptyMessage)).toBeVisible();
});

test('the active tab is scrolled into view in the tab strip', async ({ page }) => {
  const sections = page.getByRole('navigation', { name: 'Sections' });
  const lastTab = TABS[TABS.length - 1];

  // On a direct visit to a tab near the end of the strip.
  await page.goto(lastTab.path);
  await expect(sections.getByRole('link', { name: lastTab.name })).toBeInViewport({ ratio: 1 });

  // And after navigating back to the first tab.
  await sections.getByRole('link', { name: TABS[0].name }).click();
  await expect(sections.getByRole('link', { name: TABS[0].name })).toBeInViewport({ ratio: 1 });
});
