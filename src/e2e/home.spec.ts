import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Home', () => {
  test('translate', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Translate your Qwik apps into any language');
    await expect(page.locator('main')).toContainText('Hi! I am Qwik Speak');

    await expect(page.locator('title')).toContainText('Qwik Speak');
    await expect(page.locator('meta[name="description"]'))
      .toHaveAttribute(
        'content',
        'Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps'
      );
  });

  test('change language', async ({ page }) => {
    await page.locator('text=it-IT').click();

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Traduci le tue app Qwik in qualsiasi lingua');
    await expect(page.locator('main')).toContainText('Ciao! Sono Qwik Speak');

    /* await expect(page.locator('title')).toContainText('Qwik Speak');
    await expect(page.locator('meta[name="description"]'))
      .toHaveAttribute(
        'content',
        'Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik'
      ); */

    await Promise.all([
      page.waitForNavigation(),
      page.locator('text=Pagina').click()
    ]);

    await expect(page.locator('main')).toContainText('Qwik Speak');
    await expect(page.locator('main')).toContainText('Traduci le tue app Qwik in qualsiasi lingua');
  });
});
