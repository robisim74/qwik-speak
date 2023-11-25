import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/page');
});

test.describe('Page', () => {
  test('translate', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Translate your Qwik apps into any language');
    await expect(page.locator('main')).toContainText("I'm another page");
    await expect(page.locator('main')).toContainText("I'm a default value");
    await expect(page.locator('main')).toContainText("I'm a dynamic value");

    await expect(page).toHaveTitle('Page - Qwik Speak');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', "I'm another page");
  });

  test('change language', async ({ page }) => {
    await page.locator('text=Italian (Italy)').click();

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Traduci le tue app Qwik in qualsiasi lingua');
    await expect(page.locator('main')).toContainText("Sono un'altra pagina");
    await expect(page.locator('main')).toContainText("Sono un valore predefinito");
    await expect(page.locator('main')).toContainText("Sono un valore dinamico");

    await expect(page).toHaveTitle('Pagina - Qwik Speak');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', "Sono un'altra pagina");
  });
});
