const { chromium } = require('@playwright/test');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL || 'https://detailedvehiclehistory.com/', { waitUntil: 'load' });
  const homeCookies = await context.cookies();
  console.log('Homepage Cookies:', homeCookies.map(c => `${c.name}=${c.value}`));

  const vinInput = page.locator('input[placeholder*="VIN"]');
  await vinInput.waitFor({ state: 'visible', timeout: 30000 });
  await vinInput.fill('4JGED6EB0JA121898');
  await page.locator('button:has-text("Search VIN")').click();
  await page.waitForURL(/.*\/preview.*/, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const previewCookies = await context.cookies();
  console.log('Preview Cookies:', previewCookies.map(c => `${c.name}=${c.value}`));

  const ls = await page.evaluate(() => JSON.stringify(localStorage));
  console.log('LocalStorage:', ls);

  await browser.close();
})();
