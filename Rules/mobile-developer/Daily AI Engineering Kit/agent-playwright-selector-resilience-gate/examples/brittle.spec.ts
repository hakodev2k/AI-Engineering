import { test } from '@playwright/test';

test('brittle example', async ({ page }) => {
  await page.goto('/profile');
  await page.locator('form > div:nth-child(2) > input').fill('Ada');
  await page.locator('xpath=//button[2]').click();
});
