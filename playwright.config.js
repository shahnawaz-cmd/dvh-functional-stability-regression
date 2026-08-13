require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testMatch: ['**/*.spec.js'],
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
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});

