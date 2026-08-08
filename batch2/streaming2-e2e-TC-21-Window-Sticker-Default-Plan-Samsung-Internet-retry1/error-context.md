# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_21_Window_Sticker_Default_Plan
- Location: tests/streaming2-e2e.spec.js:330:1

# Error details

```
Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
```

# Test source

```ts
  336 |     // Use a robust locator and handle the known typo "Unmimited" in the UI
  337 |     const packageItem = orderSummary.locator('div:has-text("Package") ~ div span').first();
  338 |     
  339 |     // Create a regex that handles the typo (matching Unlimited or Unmimited)
  340 |     const planNameRegex = selectedData.planName.replace('Unlimited', 'Un[lm]imited');
  341 |     await expect(packageItem).toHaveText(new RegExp(planNameRegex, 'i'));
  342 |     
  343 |     // DEBUG: Log all items in the order summary
  344 |     const summaryItems = await orderSummary.locator('div').allTextContents();
  345 |     console.log('DEBUG: Order summary items:', summaryItems);
  346 | 
  347 |     // Validate Total Price (specific selector from HTML)
  348 |     // Locate the span with 'Total' text, then find the span that contains '$' within the next sibling div
  349 |     const totalLocator = orderSummary.locator('span:has-text("Total") + div span').first();
  350 |     await totalLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  351 |     
  352 |     const totalText = await totalLocator.innerText();
  353 |     const foundTotal = parseFloat(totalText.replace('$', ''));
  354 |     
  355 |     // Compare with tolerance
  356 |     // NOTE: If upsell was NOT selected/visible in UI but added in Total, 
  357 |     // it implies the app adds it automatically based on some state, not just UI click.
  358 |     // For now, accept the total IF it matches either expectedTotal or expectedTotal + upsellPrice (if upsell exists in data)
  359 |     const expectedTotalNoUpsell = planPrice;
  360 |     
  361 |     const isMatch = Math.abs(foundTotal - expectedTotal) < 0.05 || Math.abs(foundTotal - expectedTotalNoUpsell) < 0.05;
  362 |     
  363 |     expect(isMatch, `Total price mismatch. Expected $${expectedTotal} or $${expectedTotalNoUpsell}, found $${foundTotal}`).toBe(true);
  364 |     
  365 |     console.log(`✅ Total price $${foundTotal} verified in Order summary.`);
  366 | 
  367 |     // Validate Add-on (if applicable)
  368 |     if (selectedData.planName !== 'Unlimited VIN Check' && selectedData.upsellPrice) {
  369 |       // Specifically target the Add-on label to avoid strict mode violations
  370 |       const addonLabel = orderSummary.locator('div.inline-flex:has-text("Add-on")');
  371 |       await expect(addonLabel).toBeVisible();
  372 |       console.log('✅ Add-on verified in Order summary.');
  373 |     } else {
  374 |       await expect(orderSummary.locator('div:has-text("Add-on")')).not.toBeVisible();
  375 |       console.log('✅ No Add-on as expected for UVC.');
  376 |     }
  377 |   }
  378 | }
  379 | 
  380 | class EmailCache {
  381 |   constructor(page, timeout = TIMEOUT) {
  382 |     this.page = page;
  383 |     this.timeout = timeout;
  384 |     this.preview = new PreviewPage(page);
  385 |     this.validator = new PreviewToCheckoutPriceValidator(page);
  386 |   }
  387 | 
  388 |   async Cacheemailbackfromcheckout() {
  389 |     console.log("--- Starting TC_19 Email Cache Flow ---");
  390 |     
  391 |     // 1. Run checkout flow
  392 |     await this.preview.runCheckoutFlow();
  393 |     console.log("✅ Landed on checkout page (1st time)");
  394 | 
  395 |     // 2. Go back
  396 |     await this.page.goBack();
  397 |     await this.page.waitForLoadState('load');
  398 |     console.log("✅ Navigated back to Preview page");
  399 | 
  400 |     // 3. Select new plan
  401 |     const newData = await this.validator.selectRandomPlanAndHandleUpsell();
  402 |     
  403 |     // 4. Click Access Record (Expect NO email popup)
  404 |     await this.preview.clickAccessRecordButton();
  405 |     await this.page.waitForURL(/.*\/checkout.*/, { timeout: this.timeout });
  406 |     
  407 |     // Check that email popup is NOT visible
  408 |     const emailInput = this.page.locator('input[type="email"]');
  409 |     await expect(emailInput).not.toBeVisible({ timeout: 5000 });
  410 |     console.log("✅ Email popup did NOT appear, directly navigated");
  411 | 
  412 |     // 5. Validate Order Summary updated
  413 |     await this.validator.validateOrderSummary(newData);
  414 |     console.log("✅ Order summary updated correctly");
  415 |     
  416 |     return true;
  417 |   }
  418 | }
  419 | 
  420 | class DefaultPlanCheckingHandler {
  421 |   constructor(page) {
  422 |     this.page = page;
  423 |   }
  424 | 
  425 |   async sitesettingDefaultPlansVerifies(homeInstance, vin = '223870L108421', skipNavigation = false, planType = 'default') {
  426 |     if (!skipNavigation) {
  427 |       await homeInstance.navigate();
  428 |       await homeInstance.decodeVin(vin);
  429 |       await this.page.waitForURL(/.*\/preview.*/, { timeout: TIMEOUT });
  430 |     }
  431 | 
  432 |     // Ensure page is loaded before checking localStorage
  433 |     await this.page.waitForLoadState('domcontentloaded');
  434 | 
  435 |     // Wait for localStorage to be populated
> 436 |     const siteSettings = await this.page.evaluate(async () => {
      |                                          ^ Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
  437 |         for (let i = 0; i < 40; i++) {
  438 |             const val = localStorage.getItem('site_settings');
  439 |             if (val) return val;
  440 |             await new Promise(r => setTimeout(r, 500));
  441 |         }
  442 |         // DEBUG: Log all localStorage keys if not found
  443 |         const allKeys = Object.keys(localStorage);
  444 |         console.log(`DEBUG: localStorage keys (sitesetting): ${JSON.stringify(allKeys)}`);
  445 |         return null;
  446 |     });
  447 | 
  448 |     if (!siteSettings) throw new Error('site_settings not found in localStorage');
  449 | 
  450 |     const parsedSettings = JSON.parse(siteSettings);
  451 |     const targetPlanKey = planType === 'ws' ? 'default_ws_plan' : 'default_plan';
  452 |     const planData = parsedSettings[targetPlanKey];
  453 |     
  454 |     if (!planData) throw new Error(`${targetPlanKey} not found in site_settings`);
  455 |     
  456 |     console.log(`✅ Verified site_settings (${targetPlanKey}):`, planData);
  457 | 
  458 |     // Matching plan on UI - escape special characters in currency sign
  459 |     const escapedCurrency = planData.currency_sign.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  460 |     const planLocator = this.page.locator('div[role="button"]').filter({ 
  461 |         hasText: new RegExp(`${escapedCurrency}\\s*${planData.price}`) 
  462 |     }).first();
  463 |     
  464 |     await planLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  465 |     await planLocator.click();
  466 |     console.log(`✅ Matched and clicked plan: ${planData.price} ${planData.currency_sign}`);
  467 |   }
  468 | }
  469 | 
  470 | 
  471 | class UpsellTextMatched {
  472 |   constructor(page) {
  473 |     this.page = page;
  474 |   }
  475 | 
  476 |   async upsellTextVerify(pageType = 'vhr', timeout = TIMEOUT) {
  477 |     // Ensure page is loaded before checking localStorage
  478 |     await this.page.waitForLoadState('domcontentloaded');
  479 | 
  480 |     // DEBUG: Log all localStorage keys immediately
  481 |     const allKeysInitial = await this.page.evaluate(() => Object.keys(localStorage));
  482 |     console.log(`DEBUG: Initial localStorage keys (upsell): ${JSON.stringify(allKeysInitial)}`);
  483 | 
  484 |     // Wait for localStorage to be populated
  485 |     const siteSettingsStr = await this.page.evaluate(async () => {
  486 |         for (let i = 0; i < 40; i++) {
  487 |             const val = localStorage.getItem('site_settings');
  488 |             if (val) return val;
  489 |             await new Promise(r => setTimeout(r, 500));
  490 |         }
  491 |         // DEBUG: Log all localStorage keys if not found
  492 |         const allKeys = Object.keys(localStorage);
  493 |         console.log(`DEBUG: Final localStorage keys (upsell): ${JSON.stringify(allKeys)}`);
  494 |         return null;
  495 |     });
  496 | 
  497 |     if (!siteSettingsStr) throw new Error('site_settings not found in localStorage');
  498 |     const siteSettings = JSON.parse(siteSettingsStr);
  499 | 
  500 |     let textKey, priceKey;
  501 |     if (pageType === 'sticker') {
  502 |       textKey = 'report_preview_page_checkbox_text';
  503 |       priceKey = 'report_preview_page_checkbox_price';
  504 |     } else {
  505 |       textKey = 'sticker_preview_page_checkbox_text';
  506 |       priceKey = 'sticker_preview_page_checkbox_price';
  507 |     }
  508 | 
  509 |     const expectedText = siteSettings[textKey];
  510 |     const expectedPrice = siteSettings[priceKey];
  511 | 
  512 |     if (!expectedText || !expectedPrice) {
  513 |       throw new Error(`Required settings ${textKey} or ${priceKey} missing in site_settings`);
  514 |     }
  515 | 
  516 |     console.log(`✅ Validating Upsell for ${pageType}: Text='${expectedText}', Price='${expectedPrice}'`);
  517 | 
  518 |     // Match based on text and price
  519 |     const upsellLocator = this.page.locator('label:has(input[type="checkbox"])').filter({ 
  520 |         hasText: new RegExp(`${expectedText}.*${expectedPrice}`, 'i') 
  521 |     });
  522 | 
  523 |     await upsellLocator.waitFor({ state: 'visible', timeout });
  524 |     await expect(upsellLocator).toBeVisible();
  525 |     console.log('✅ Upsell text and price matched on UI.');
  526 |   }
  527 | }
  528 | 
  529 | module.exports = { PreviewPage, PreviewToCheckoutPriceValidator, EmailCache, DefaultPlanCheckingHandler, UpsellTextMatched };
  530 | 
```