import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/page');
});

test.describe('Page', () => {
  test('translate', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText("I'm another page");
  });

  test('change language', async ({ page }) => {
    const change = page.locator('text=it-IT');
    await change.click();

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText("Io sono un'altra pagina");
  });
});
