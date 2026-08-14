// non_streaming_flow/tasks/NonStreamingDefaultPlanPriceCheckTask.js
const { expect } = require('@playwright/test');

class NonStreamingDefaultPlanPriceCheckTask {
  constructor(timeout = process.env.CI ? 60000 : 30000) {
    this.timeout = timeout;
  }

  async perform(page) {
    console.log('💲 [NonStreamingDefaultPlanPriceCheckTask] Executing Robust Default Plan Price Check Task...');

    await page.waitForLoadState('domcontentloaded');

    // 1. Inspect localStorage / __NEXT_DATA__ for default_plan
    const planData = await page.evaluate(async () => {
      for (let i = 0; i < 20; i++) {
        const val = localStorage.getItem('site_settings');
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (parsed.default_plan) return parsed.default_plan;
            if (parsed.price || parsed.total) return parsed;
          } catch (e) {}
        }
        await new Promise(r => setTimeout(r, 500));
      }

      try {
        const nextData = window.__NEXT_DATA__;
        const pageProps = nextData?.props?.pageProps;
        if (pageProps?.siteSettings?.default_plan) {
          return pageProps.siteSettings.default_plan;
        }
      } catch (e) {}

      return null;
    });

    if (!planData) {
      throw new Error('❌ Failed: site_settings.default_plan data not found in localStorage or __NEXT_DATA__.');
    }

    console.log('✅ Verified site_settings planData:', planData);

    const rawPrice = planData.price || planData.total || planData.amount;
    if (!rawPrice) {
      throw new Error('❌ Failed: No price property found in site_settings.default_plan.');
    }

    const numPrice = parseFloat(rawPrice);
    const roundedPrice = !isNaN(numPrice) ? (Math.round(numPrice * 100) / 100).toFixed(2) : rawPrice;
    const intPrice = !isNaN(numPrice) ? Math.round(numPrice).toString() : rawPrice;
    const currencySign = planData.currency_sign || '$';

    console.log(`🔍 Searching Preview Page DOM for Price: ${currencySign}${roundedPrice} (Raw: ${rawPrice}, Int: ${intPrice})`);

    // 2. Extract DOM text elements and search for currency & rounded/raw/int price
    const isPriceFoundOnUI = await page.evaluate(({ currencySign, roundedPrice, intPrice, rawPrice }) => {
      const allElements = Array.from(document.querySelectorAll('body *'));
      return allElements.some(el => {
        // Only check leaf or text-containing nodes
        if (el.children.length > 5) return false;
        const text = el.textContent || '';
        
        // Escape special regex characters in currency sign (e.g. $)
        const escapedSign = currencySign.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Match patterns: $19.99, $ 19.99, 19.99$, 19.99
        const priceRegexes = [
          new RegExp(`${escapedSign}\\s*${roundedPrice}`),
          new RegExp(`${escapedSign}\\s*${rawPrice}`),
          new RegExp(`${escapedSign}\\s*${intPrice}`),
          new RegExp(`${roundedPrice}\\s*${escapedSign}`),
          new RegExp(`\\b${roundedPrice}\\b`)
        ];

        return priceRegexes.some(regex => regex.test(text));
      });
    }, { currencySign, roundedPrice, intPrice, rawPrice });

    if (!isPriceFoundOnUI) {
      // Fallback: search entire body innerText
      const bodyText = await page.innerText('body').catch(() => '');
      const fallbackFound = bodyText.includes(roundedPrice) || bodyText.includes(rawPrice) || bodyText.includes(`${currencySign}${roundedPrice}`);
      
      if (!fallbackFound) {
        throw new Error(`❌ Failed: Default plan price (${currencySign}${roundedPrice}) from localStorage site_settings was NOT found on Preview Page UI.`);
      }
    }

    console.log(`✅ Success: Default plan price ${currencySign}${roundedPrice} matching localStorage site_settings is rendered on Preview Page UI.`);
  }
}

module.exports = { NonStreamingDefaultPlanPriceCheckTask };
