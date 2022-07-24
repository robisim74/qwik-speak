import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Home', () => {
  test('translate', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Qwik Speak');
    await expect(page.locator('body')).toContainText('Make your Qwik app speak any language');
    await expect(page.locator('body')).toContainText('Hi! I am Qwik Speak');
  });

  test('change language', async ({ page }) => {
    const change = page.locator('text=it-IT');
    await change.click();

    await expect(page.locator('body')).toContainText('Qwik Speak');
    await expect(page.locator('body')).toContainText('Fai parlare alla tua app Qwik qualsiasi lingua');
    await expect(page.locator('body')).toContainText('Ciao! Sono Qwik Speak');

    await page.locator('text=Pagina').click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toContainText('Qwik Speak');
    await expect(page.locator('body')).toContainText("Io sono un'altra pagina");
  });
});
