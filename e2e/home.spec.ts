import { expect, test } from '@playwright/test';

test('home page loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');

  await expect(page.getByText('Hello World')).toBeVisible();
  expect(errors).toEqual([]);
});
