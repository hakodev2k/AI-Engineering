import { test, expect } from '@playwright/test';

test('scanner fixture contains brittle selectors', async ({ page }) => {
  await page.goto('https://example.invalid');
  const save = page.locator('form > div:nth-child(3) > button');
  await expect(save).toBeVisible();
});
