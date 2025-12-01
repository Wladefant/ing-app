import { test, expect } from '@playwright/test';

test('Junior Buy/Sell Stock Flow', async ({ page }) => {
    // 1. Start app
    await page.goto('http://localhost:5000/');

    // 2. Switch to Junior profile
    const switchButton = page.getByRole('button', { name: 'Zu Junior wechseln' });

    // Wait for button to be attached
    await switchButton.waitFor({ state: 'attached' });

    if (await switchButton.isVisible()) {
        await switchButton.click();
    }

    // 3. Navigate to Invest screen
    await page.getByRole('button', { name: 'Invest' }).click();

    // 4. Click on a stock (ING)
    await page.getByText('ING Groep N.V.').first().click();

    // 5. Click "Virtuell kaufen"
    await page.getByRole('button', { name: 'Virtuell kaufen' }).click();

    // 6. Verify Dialog opens
    await expect(page.getByRole('heading', { name: 'Aktie kaufen' })).toBeVisible();
    await expect(page.getByText('Verfügbares Spielgeld:')).toBeVisible();

    // 7. Enter amount/shares
    await expect(page.locator('.text-4xl.font-bold').filter({ hasText: '1' })).toBeVisible();

    // Increase shares
    await page.getByLabel('Mehr').click();
    await expect(page.locator('.text-4xl.font-bold').filter({ hasText: '2' })).toBeVisible();

    // 8. Click "Weiter"
    await page.getByRole('button', { name: 'Weiter' }).click();

    // 9. Confirm step
    await expect(page.getByRole('heading', { name: 'Order bestätigen' })).toBeVisible();
    await expect(page.getByText('2x ING Groep N.V.')).toBeVisible();

    await page.getByRole('button', { name: 'Kostenpflichtig kaufen' }).click();

    // 10. Success step
    await expect(page.getByRole('heading', { name: 'Kauf erfolgreich!' })).toBeVisible();
    await expect(page.getByText('XP erhalten!')).toBeVisible();

    // 11. Close dialog
    await page.getByRole('button', { name: 'Fertig' }).click();

    // 12. Verify dialog closed
    await expect(page.getByRole('heading', { name: 'Kauf erfolgreich!' })).not.toBeVisible();

    // 13. Verify we are back on stock detail
    await expect(page.getByText('ING Groep N.V.')).toBeVisible();
});
