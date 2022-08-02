import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Home', () => {
  test('translate', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Translate your Qwik apps into any language');
    await expect(page.locator('main')).toContainText('Hi! I am Qwik Speak');
  });

  test('change language', async ({ page }) => {
    const change = page.locator('text=it-IT');
    await change.click();

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Traduci le tue app Qwik in qualsiasi lingua');
    await expect(page.locator('main')).toContainText('Ciao! Sono Qwik Speak');

    await Promise.all([
      page.waitForNavigation(),
      page.locator('text=Pagina').click()
    ]);

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText("Io sono un'altra pagina");
  });
});
