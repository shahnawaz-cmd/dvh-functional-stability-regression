// non_streaming_flow/tasks/CalculateCheckoutTimeTask.js
const { expect } = require('@playwright/test');

class CalculateCheckoutTimeTask {
  static async execute(page, timeout = process.env.CI ? 90000 : 45000) {
    console.log('⏱️ [CalculateCheckoutTimeTask] Starting Checkout Redirection time tracking...');

    const popupTimeout = process.env.CI ? 20000 : 10000;

    // 1. Click primary button to open email popup/form if present
    const startButton = page.getByRole('button', { name: /access records|get window sticker|view full report/i }).first();
    await startButton.waitFor({ state: 'visible', timeout: popupTimeout }).catch(() => {});
    if (await startButton.isVisible()) {
      await startButton.click();
    }

    // 2. Input email when field is visible
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: popupTimeout });
    const suffix = Math.random().toString(36).substring(2, 5);
    await emailInput.fill(`rolex.rolls12+${suffix}@gmail.com`);

    // 3. Start timer before clicking checkout
    const startTime = Date.now();

    const checkoutButton = page.getByRole('button', { name: /proceed to checkout|access records/i }).last();
    await checkoutButton.waitFor({ state: 'visible', timeout: popupTimeout });
    await checkoutButton.click();

    // 4. Wait until redirected to checkout page
    await page.waitForURL(/.*(checkout|payment|billing|order).*/, { timeout });

    const endTime = Date.now();
    const durationSeconds = Number(((endTime - startTime) / 1000).toFixed(2));

    console.log('\n' + '-'.repeat(50));
    console.log(`⏱️ Checkout Redirection Time: ${durationSeconds} seconds`);
    console.log(`🛒 Checkout URL              : ${page.url()}`);
    console.log('-'.repeat(50) + '\n');

    return { durationSeconds, checkoutUrl: page.url() };
  }
}

module.exports = { CalculateCheckoutTimeTask };
