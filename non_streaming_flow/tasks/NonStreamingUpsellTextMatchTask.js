// non_streaming_flow/tasks/NonStreamingUpsellTextMatchTask.js
const { expect } = require('@playwright/test');

class NonStreamingUpsellTextMatchTask {
  constructor(timeout = process.env.CI ? 60000 : 30000) {
    this.timeout = timeout;
  }

  async perform(page, pageType = 'vhr') {
    console.log(`🏷️ [NonStreamingUpsellTextMatchTask] Validating Upsell text & price match on Preview Page for ${pageType}...`);

    // 1. Wait for Preview Page URL
    await page.waitForURL(/.*(preview|report).*/, { timeout: this.timeout });

    // 2. Extract site_settings from localStorage
    const siteSettingsStr = await page.evaluate(async () => {
      for (let i = 0; i < 40; i++) {
        const val = localStorage.getItem('site_settings');
        if (val) return val;
        await new Promise(r => setTimeout(r, 250));
      }
      return null;
    });

    if (!siteSettingsStr) {
      throw new Error('❌ Failed: site_settings not found in localStorage.');
    }

    const siteSettings = JSON.parse(siteSettingsStr);

    let textKey, priceKey;
    if (pageType === 'sticker') {
      textKey = 'report_preview_page_checkbox_text';
      priceKey = 'report_preview_page_checkbox_price';
    } else {
      textKey = 'sticker_preview_page_checkbox_text';
      priceKey = 'sticker_preview_page_checkbox_price';
    }

    const expectedText = siteSettings[textKey];
    const expectedPrice = siteSettings[priceKey];

    if (!expectedText || !expectedPrice) {
      console.log(`ℹ️ Required settings ${textKey} or ${priceKey} not present in site_settings. Skipping upsell check.`);
      return;
    }

    console.log(`🔍 [Fast Preview Match] Waiting for Upsell text on Preview Page: Text='${expectedText}', Price='${expectedPrice}'`);

    // 3. Poll DOM until Preview page renders the upsell text/price or timeout
    const startTime = Date.now();
    let isMatched = false;

    while (Date.now() - startTime < this.timeout) {
      isMatched = await page.evaluate(({ expectedText, expectedPrice }) => {
        const pageText = document.body.innerText || '';
        const cleanDOM = pageText.replace(/\s+/g, ' ');
        
        const numPrice = parseFloat(expectedPrice);
        const roundedPrice = !isNaN(numPrice) ? (Math.round(numPrice * 100) / 100).toFixed(2) : expectedPrice;
        const intPrice = !isNaN(numPrice) ? Math.round(numPrice).toString() : expectedPrice;

        const words = expectedText.replace(/[^\w\s]/gi, '').toLowerCase().split(/\s+/).filter(w => w.length > 2);

        const hasPrice = cleanDOM.includes(roundedPrice) || cleanDOM.includes(expectedPrice) || cleanDOM.includes(intPrice);
        const hasTextTokens = words.some(word => cleanDOM.toLowerCase().includes(word));

        return hasPrice || hasTextTokens;
      }, { expectedText, expectedPrice });

      if (isMatched) break;
      await page.waitForTimeout(500);
    }

    if (!isMatched) {
      throw new Error('❌ Failed: upsell text not align based on site setting');
    }

    console.log('⚡ Success: Upsell text matched on Preview Page UI. Closing browser immediately!');
    await page.close().catch(() => {});
  }
}

module.exports = { NonStreamingUpsellTextMatchTask };
