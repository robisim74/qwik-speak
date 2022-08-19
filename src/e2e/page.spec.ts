import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en-US/page');
});

test.describe('Page', () => {
  test('translate', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Translate your Qwik apps into any language');

    await expect(page.locator('title')).toContainText('Page - Qwik Speak');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', "I'm another page");
  });

  test('change language', async ({ page }) => {
    await page.locator('text=it-IT').click();

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Traduci le tue app Qwik in qualsiasi lingua');
    await expect(page.locator('main')).toContainText("I'm a fallback text");

    await expect(page.locator('title')).toContainText('Pagina - Qwik Speak');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', "Io sono un'altra pagina");
  });
});
