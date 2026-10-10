# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/streaming2-e2e.spec.js >> TC_22_VHR_Upsell_Text_Validation
- Location: tests/streaming2-e2e.spec.js:440:1

# Error details

```
Error: site_settings not found in localStorage
```

# Test source

```ts
  572 |     await this.page.waitForLoadState('load');
  573 |     console.log("✅ Navigated back to Preview page");
  574 | 
  575 |     // 3. Select new plan
  576 |     const newData = await this.validator.selectRandomPlanAndHandleUpsell();
  577 |     
  578 |     // 4. Click Access Record (Expect NO email popup)
  579 |     await this.preview.clickAccessRecordButton();
  580 |     await this.page.waitForURL(/.*\/checkout.*/, { timeout: this.timeout });
  581 |     
  582 |     // Check that email popup is NOT visible
  583 |     const emailInput = this.page.locator('input[type="email"]');
  584 |     await expect(emailInput).not.toBeVisible({ timeout: 5000 });
  585 |     console.log("✅ Email popup did NOT appear, directly navigated");
  586 | 
  587 |     // 5. Validate Order Summary updated
  588 |     await this.validator.validateOrderSummary(newData);
  589 |     console.log("✅ Order summary updated correctly");
  590 |     
  591 |     return true;
  592 |   }
  593 | }
  594 | 
  595 | class DefaultPlanCheckingHandler {
  596 |   constructor(page) {
  597 |     this.page = page;
  598 |   }
  599 | 
  600 |   async sitesettingDefaultPlansVerifies(homeInstance, vin = '223870L108421', skipNavigation = false, planType = 'default') {
  601 |     if (!skipNavigation) {
  602 |       await homeInstance.navigate();
  603 |       await homeInstance.decodeVin(vin);
  604 |     }
  605 | 
  606 |     // Ensure we are on preview page before inspecting localStorage
  607 |     await this.page.waitForURL(/.*\/preview.*/, { timeout: TIMEOUT }).catch(() => {});
  608 |     await this.page.waitForLoadState('domcontentloaded');
  609 | 
  610 |     // Wait for localStorage to be populated with resilience against navigation context changes
  611 |     let siteSettings = null;
  612 |     for (let i = 0; i < 40; i++) {
  613 |       try {
  614 |         siteSettings = await this.page.evaluate(() => localStorage.getItem('site_settings'));
  615 |         if (siteSettings) break;
  616 |       } catch (e) {
  617 |         // Handle transient execution context destruction during page transition
  618 |       }
  619 |       await this.page.waitForTimeout(500);
  620 |     }
  621 | 
  622 |     if (!siteSettings) throw new Error('site_settings not found in localStorage');
  623 | 
  624 |     const parsedSettings = JSON.parse(siteSettings);
  625 |     const targetPlanKey = planType === 'ws' ? 'default_ws_plan' : 'default_plan';
  626 |     const planData = parsedSettings[targetPlanKey];
  627 |     
  628 |     if (!planData) throw new Error(`${targetPlanKey} not found in site_settings`);
  629 |     
  630 |     console.log(`✅ Verified site_settings (${targetPlanKey}):`, planData);
  631 | 
  632 |     // Matching plan on UI - escape special characters in currency sign
  633 |     const escapedCurrency = planData.currency_sign.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  634 |     const planLocator = this.page.locator('div[role="button"]').filter({ 
  635 |         hasText: new RegExp(`${escapedCurrency}\\s*${planData.price}`) 
  636 |     }).first();
  637 |     
  638 |     await planLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  639 |     await planLocator.scrollIntoViewIfNeeded();
  640 |     await planLocator.click();
  641 |     console.log(`✅ Matched and clicked plan: ${planData.price} ${planData.currency_sign}`);
  642 |   }
  643 | }
  644 | 
  645 | 
  646 | class UpsellTextMatched {
  647 |   constructor(page) {
  648 |     this.page = page;
  649 |   }
  650 | 
  651 |   async upsellTextVerify(pageType = 'vhr', timeout = TIMEOUT, testInfo = null) {
  652 |     // Ensure page is loaded before checking localStorage
  653 |     await this.page.waitForLoadState('domcontentloaded');
  654 | 
  655 |     // DEBUG: Log all localStorage keys immediately
  656 |     const allKeysInitial = await this.page.evaluate(() => Object.keys(localStorage));
  657 |     console.log(`DEBUG: Initial localStorage keys (upsell): ${JSON.stringify(allKeysInitial)}`);
  658 | 
  659 |     // Wait for localStorage to be populated
  660 |     const siteSettingsStr = await this.page.evaluate(async () => {
  661 |         for (let i = 0; i < 40; i++) {
  662 |             const val = localStorage.getItem('site_settings');
  663 |             if (val) return val;
  664 |             await new Promise(r => setTimeout(r, 500));
  665 |         }
  666 |         // DEBUG: Log all localStorage keys if not found
  667 |         const allKeys = Object.keys(localStorage);
  668 |         console.log(`DEBUG: Final localStorage keys (upsell): ${JSON.stringify(allKeys)}`);
  669 |         return null;
  670 |     });
  671 | 
> 672 |     if (!siteSettingsStr) throw new Error('site_settings not found in localStorage');
      |                                 ^ Error: site_settings not found in localStorage
  673 |     const siteSettings = JSON.parse(siteSettingsStr);
  674 | 
  675 |     let textKey, priceKey;
  676 |     if (pageType === 'sticker') {
  677 |       textKey = 'report_preview_page_checkbox_text';
  678 |       priceKey = 'report_preview_page_checkbox_price';
  679 |     } else {
  680 |       textKey = 'sticker_preview_page_checkbox_text';
  681 |       priceKey = 'sticker_preview_page_checkbox_price';
  682 |     }
  683 | 
  684 |     const expectedText = siteSettings[textKey];
  685 |     const rawPrice = siteSettings[priceKey];
  686 | 
  687 |     if (!expectedText || !rawPrice) {
  688 |       throw new Error(`Required settings ${textKey} or ${priceKey} missing in site_settings`);
  689 |     }
  690 | 
  691 |     // Dynamic Currency Calculation (supports USD, MXN, EUR, GBP, etc.)
  692 |     const currencyRate = parseFloat(siteSettings.currency_rate) || 1;
  693 |     const basePriceNum = parseFloat(rawPrice);
  694 |     const convertedPrice = !isNaN(basePriceNum) ? (basePriceNum * currencyRate).toFixed(2) : rawPrice;
  695 | 
  696 |     console.log(`✅ Validating Upsell for ${pageType}: Text='${expectedText}', Base Price='${rawPrice}', Converted Price='${convertedPrice}'`);
  697 | 
  698 |     // Match raw USD price, converted localized price, or dynamic localized number format
  699 |     const escapedText = expectedText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  700 |     const pricePattern = `(?:${rawPrice.replace('.', '\\.')}|${convertedPrice.replace('.', '\\.')}|\\d+(?:\\.\\d{1,2})?)`;
  701 | 
  702 |     const upsellLocator = this.page.locator('label:has(input[type="checkbox"])').filter({ 
  703 |         hasText: new RegExp(`${escapedText}.*${pricePattern}`, 'i') 
  704 |     });
  705 | 
  706 |     await upsellLocator.waitFor({ state: 'visible', timeout });
  707 |     await expect(upsellLocator).toBeVisible();
  708 |     console.log('✅ Upsell text and price matched on UI.');
  709 | 
  710 |     // Attach Screenshot to Playwright & Allure Report upon Pass
  711 |     if (testInfo) {
  712 |       const screenshot = await this.page.screenshot({ fullPage: true });
  713 |       await testInfo.attach(`Upsell_Validation_Pass_${pageType}`, {
  714 |         body: screenshot,
  715 |         contentType: 'image/png'
  716 |       });
  717 |       console.log(`📸 Attached pass screenshot to report for ${pageType} upsell validation.`);
  718 |     }
  719 |   }
  720 | }
  721 | 
  722 | module.exports = { PreviewPage, PreviewToCheckoutPriceValidator, EmailCache, DefaultPlanCheckingHandler, UpsellTextMatched };
  723 | 
```