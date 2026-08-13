// run-flow.js
const { execSync } = require('child_process');
const { chromium } = require('@playwright/test');
const config = require('./playwright.config');
require('dotenv').config();

async function runFlowDetectionAndExecute() {
  const rawArgs = process.argv.slice(2);
  const isHeaded = rawArgs.includes('--headed');
  const projectArg = rawArgs.find(a => a.startsWith('--project='));
  const projectName = projectArg ? projectArg.split('=')[1].replace(/['"]/g, '') : null;

  // Resolve browser settings from playwright.config.js
  const projectConfig = config.projects.find(p => p.name === projectName) || config.projects[0];
  const browserType = projectConfig.use?.browserName || 'chromium';
  const baseURL = config.use?.baseURL || process.env.BASE_URL;

  console.log(`--- [Flow Orchestrator] Detecting Cookie & Flow (${browserType}, Headed: ${isHeaded}) ---`);

  const browser = await require('@playwright/test')[browserType].launch({ headless: !isHeaded });
  const context = await browser.newContext(projectConfig.use || {});
  const page = await context.newPage();

  let flowType = null; // No fallback default

  try {
    if (baseURL) {
      await page.goto(baseURL, { waitUntil: 'networkidle' });

      const cookies = await context.cookies();
      const flowCookie = cookies.find((c) => c.name === 'checkout_flow');

      if (flowCookie) {
        flowType = flowCookie.value;
      } else {
        // Check localStorage if cookie is not present
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
        }
      }
    }
  } catch (error) {
    console.error('[Flow Orchestrator] Error detecting cookies:', error.message);
  } finally {
    await browser.close();
  }

  const isNonStreaming = flowType === 'non_streaming';
  const isStreaming = flowType === 'streaming';

  console.log('--------------------------------------------------');
  console.log(`Detected Checkout Flow : ${flowType || 'UNKNOWN'}`);
  console.log(`Is Non-Streaming Flow  : ${isNonStreaming}`);
  console.log(`Is Streaming Flow      : ${isStreaming}`);
  console.log('--------------------------------------------------');

  if (!flowType) {
    console.error('❌ Flow Detection Failed: Could not detect checkout_flow cookie or localStorage setting.');
    process.exit(1);
  }

  const formattedArgs = rawArgs.map(arg => arg.includes(' ') ? `"${arg}"` : arg).join(' ');

  if (isNonStreaming) {
    console.log('🚀 Triggering NON-STREAMING Suite: non_streaming_flow/nonstreaming.spec.js');
    execSync(`npx playwright test non_streaming_flow/nonstreaming.spec.js ${formattedArgs}`, { stdio: 'inherit' });
  } else if (isStreaming) {
    console.log('🚀 Triggering STREAMING Suite: tests/streaming2-e2e.spec.js');
    execSync(`npx playwright test tests/streaming2-e2e.spec.js ${formattedArgs}`, { stdio: 'inherit' });
  } else {
    console.error(`❌ Flow Detection Failed: Unknown flowType value "${flowType}".`);
    process.exit(1);
  }
}

runFlowDetectionAndExecute();
