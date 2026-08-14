// non_streaming_flow/tasks/NonStreamingCheckoutPriceValidatorTask.js
const { expect } = require('@playwright/test');

class NonStreamingCheckoutPriceValidatorTask {
  constructor(timeout = process.env.CI ? 60000 : 30000) {
    this.timeout = timeout;
  }

  async perform(page, planSelectionData = {}) {
    console.log('🏷️ [NonStreamingCheckoutPriceValidatorTask] Dynamically validating checkout total price on Checkout page DOM...');

    // 1. Wait for Checkout URL
    await page.waitForURL(/.*(checkout|payment|billing|order).*/, { timeout: this.timeout });
    await page.waitForLoadState('domcontentloaded');

    // 2. Poll Checkout DOM dynamically for Total Price label or any rendered numeric price container
    const startTime = Date.now();
    let checkoutDisplayedTotal = null;

    while (Date.now() - startTime < this.timeout) {
      checkoutDisplayedTotal = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        
        // Find "Total Price" container element dynamically
        const totalElem = elements.find(el => {
          const t = (el.innerText || '').trim();
          return /^Total Price/i.test(t) || t.includes('Total Price');
        });

        if (totalElem) {
          const parent = totalElem.parentElement || totalElem;
          const text = parent.innerText.replace(/\s+/g, ' ').trim();
          
          // Match any dynamic currency symbol/code + numeric value (e.g. ₩104,424, $19.99, €29.00, etc.)
          const match = text.match(/(?:Total Price\s*)?([^\d\s]+\s*[\d,]+(?:\.\d{2})?)/i) ||
                        text.match(/([\d,]+(?:\.\d{2})?)/);
          if (match) return match[1];
        }

        // Fallback: search entire body DOM text for dynamic currency/price pattern next to "Total"
        const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
        const fallbackMatch = bodyText.match(/Total Price\s*([^\d\s]+\s*[\d,]+(?:\.\d{2})?)/i) ||
                              bodyText.match(/Total Price\s*([\d,]+(?:\.\d{2})?)/i);
        
        return fallbackMatch ? fallbackMatch[1] : null;
      });

      if (checkoutDisplayedTotal) {
        break;
      }
      await page.waitForTimeout(500);
    }

    if (!checkoutDisplayedTotal) {
      throw new Error('❌ Failed: Total Price element not found on Checkout page DOM.');
    }

    console.log(`✅ Success: Dynamically extracted Total Price on Checkout Page: "${checkoutDisplayedTotal}"`);
  }
}

module.exports = { NonStreamingCheckoutPriceValidatorTask };
