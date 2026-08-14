// non_streaming_flow/tasks/NonStreamingPreviewToCheckoutRedirectionTask.js
const { expect } = require('@playwright/test');

class NonStreamingPreviewToCheckoutRedirectionTask {
  constructor(timeout = process.env.CI ? 90000 : 45000) {
    this.timeout = timeout;
  }

  async fillEmailAndProceed(page) {
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

    // 3. Click final submit/checkout button once visible
    const checkoutButton = page.getByRole('button', { name: /proceed to checkout|access records/i }).last();
    await checkoutButton.waitFor({ state: 'visible', timeout: popupTimeout });
    await checkoutButton.click();
  }

  async perform(page) {
    console.log('🏷️ [NonStreamingPreviewToCheckoutRedirectionTask] Filling email on Preview page and proceeding to checkout...');
    
    // Wait until on Preview page URL
    await page.waitForURL(/.*(preview|report).*/, { timeout: this.timeout }).catch(() => {});
    
    await this.fillEmailAndProceed(page);
    
    // 4. Wait for URL redirection to checkout page
    console.log('⌛ Waiting for checkout redirection URL...');
    await page.waitForURL(/.*(checkout|payment|billing|order).*/, { timeout: this.timeout });
    
    console.log(`✅ Success: Redirected to Checkout page: ${page.url()}`);
  }
}

module.exports = { NonStreamingPreviewToCheckoutRedirectionTask };
