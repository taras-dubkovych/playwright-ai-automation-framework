import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';

test('homepage via POM: title and get started link', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(page).toHaveTitle(/Playwright/);
  await expect(homePage.startedLink).toBeVisible();

  await homePage.clickGetStarted();
  await expect(page).toHaveURL(/.*docs/);
});
