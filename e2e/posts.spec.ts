import { expect, test } from '@playwright/test';

import { BLOGS } from '../src/data/blogs';

test('every tech post opens from the list and renders without errors', async ({ page }) => {
  await page.goto(BLOGS.tech.path);
  const links = page.getByRole('main').getByRole('listitem').getByRole('link');
  const posts = await links.evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute('href') ?? '',
      title: anchor.querySelector('h2')?.textContent ?? '',
    }))
  );
  expect(posts.length).toBeGreaterThan(0);

  for (const post of posts) {
    const errors: string[] = [];
    const handleConsole = (message: { type: () => string; text: () => string }) => {
      if (message.type() === 'error') errors.push(message.text());
    };
    page.on('console', handleConsole);

    const response = await page.goto(post.href);
    expect(response?.status(), post.href).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll, post.href).toBe(false);
    expect(errors, post.href).toEqual([]);
    page.off('console', handleConsole);
  }
});

test('the back link returns from a post to its blog', async ({ page }) => {
  await page.goto(BLOGS.tech.path);
  await page.getByRole('main').getByRole('listitem').first().getByRole('link').click();
  await expect(page).toHaveURL(new RegExp(`${BLOGS.tech.path}/[a-z0-9-]+$`));

  await page.getByRole('link', { name: BLOGS.tech.label }).click();
  await expect(page).toHaveURL(BLOGS.tech.path);
});

test('links between posts open the linked post on this site', async ({ page }) => {
  await page.goto(`${BLOGS.tech.path}/my-gsoc-21-journey-week-9`);
  await page.getByRole('link', { name: 'Introductory Blog' }).click();

  await expect(page).toHaveURL(`${BLOGS.tech.path}/my-gsoc-21-journey-getting-started`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'My GSoC ’21 Journey: Getting Started'
  );
});

// Unknown slugs render on request after the static shell has streamed, so Next.js keeps a 200
// status and serves the not-found page with a noindex tag (a "soft 404").
test('slugs that are not posts show the not-found page and are not indexed', async ({ page }) => {
  for (const path of [
    `${BLOGS.tech.path}/not-a-real-post`,
    `${BLOGS.tech.path}/_template`,
    `${BLOGS.travel.path}/not-a-real-post`,
  ]) {
    await page.goto(path);
    await expect(page.getByText('This page could not be found.'), path).toBeVisible();
    await expect(
      page.locator('meta[name="robots"][content="noindex"]').first(),
      path
    ).toBeAttached();
  }
});
