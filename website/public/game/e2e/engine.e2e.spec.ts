// e2e/engine.e2e.spec.ts
import { test, expect } from '@playwright/test';

test('Engine initializes with visible canvas', async ({ page }) => {
    await page.goto('http://127.0.0.1:4000/game/index.html');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
});
