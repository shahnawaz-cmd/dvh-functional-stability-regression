// detect-flow.js
const { chromium } = require('@playwright/test');
require('dotenv').config();

async function detectFlow() {
  const baseURL = process.env.BASE_URL || 'https://detailedvehiclehistory.com/';
  console.log(`--- [Flow Detection] Checking URL: ${baseURL} ---`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let flowType = null;

  try {
    await page.goto(baseURL, { waitUntil: 'load' });
    
    // Poll up to 10 seconds for checkout_flow cookie or localStorage setting
    for (let attempt = 0; attempt < 20; attempt++) {
      await page.waitForTimeout(500);
      
      const cookies = await context.cookies();
      const flowCookie = cookies.find((c) => c.name === 'checkout_flow');

      if (flowCookie) {
        flowType = flowCookie.value;
        break;
      }

      const lsFlow = await page.evaluate(() => {
        try {
          const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
          return settings.checkout_flow || null;
        } catch (e) {
          return null;
        }
      });

      if (lsFlow) {
        flowType = lsFlow;
        break;
      }
    }
  } catch (error) {
    console.error('[Flow Detection] Error checking website flow:', error.message);
  } finally {
    await browser.close();
  }

  if (!flowType) {
    console.error('❌ Flow Detection Failed: Could not detect checkout_flow cookie or localStorage.');
    process.exit(1);
  }

  console.log('--------------------------------------------------');
  console.log(`Detected Checkout Flow : ${flowType}`);
  console.log('--------------------------------------------------');

  // Output format for GitHub Actions GITHUB_OUTPUT if running in CI
  if (process.env.GITHUB_OUTPUT) {
    const fs = require('fs');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `flow_type=${flowType}\n`);
  }

  return flowType;
}

detectFlow();
