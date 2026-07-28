require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: 1, // Reduced to 1 retry
  reporter: [['html', { open: 'never' }]],
  fullyParallel: true,
  workers: 2,
  use: {
    headless: true,
    baseURL: process.env.BASE_URL,
    locale: 'en-US',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    /* Desktop Projects */
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
      },
    },

    /* Mobile Projects */
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'Mobile Edge',
      use: {
        browserName: 'chromium',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 EdgA/122.0.0.0',
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'Samsung Internet',
      use: {
        browserName: 'chromium',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/22.0 Chrome/111.0.0.0 Mobile Safari/537.36',
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});

