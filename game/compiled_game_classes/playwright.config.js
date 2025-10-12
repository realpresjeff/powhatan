// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:4000', // Adjust based on your dev server
        browserName: 'chromium',
        headless: true,
    },
});
