import { test, expect } from '@playwright/test';

test('user can save profile', async ({ page }) => {
  await page.goto('/profile');
  await page.getByLabel('Display name').fill('Ada');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('status')).toHaveText(/saved/i);
});
