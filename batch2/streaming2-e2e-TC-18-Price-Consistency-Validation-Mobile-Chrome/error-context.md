# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_18_Price_Consistency_Validation
- Location: tests/streaming2-e2e.spec.js:297:1

# Error details

```
Error: Total price mismatch. Expected $109.94 or $99.95, found $69.98

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  230 |     // Select plan by name only, ignoring dynamic price/currency
  231 |     const plans = [
  232 |       { name: '1 Report', reports: 1, locator: this.page.locator('div[role="button"]').filter({ hasText: /^1 Report/ }) },
  233 |       { name: '2 Reports', reports: 2, locator: this.page.locator('div[role="button"]').filter({ hasText: /^2 Reports/ }) },
  234 |       { name: '5 Reports', reports: 5, locator: this.page.locator('div[role="button"]').filter({ hasText: /^5 Reports/ }) },
  235 |       { name: 'Unlimited VIN Check', reports: 0, locator: this.page.locator('div[role="button"]').filter({ hasText: /^Unlimited VIN Check/ }) }
  236 |     ];
  237 | 
  238 |     const randomPlan = plans[Math.floor(Math.random() * plans.length)];
  239 |     
  240 |     // Capture price from the plan element dynamically
  241 |     await randomPlan.locator.waitFor({ state: 'visible', timeout: TIMEOUT });
  242 |     const priceText = await randomPlan.locator.innerText();
  243 |     const priceMatches = priceText.match(/\$\d+(\.\d{2})?/g);
  244 |     let maxPrice = 0;
  245 |     if (priceMatches) {
  246 |       for (const match of priceMatches) {
  247 |         const p = parseFloat(match.replace('$', ''));
  248 |         if (p > maxPrice) maxPrice = p;
  249 |       }
  250 |     }
  251 |     const totalPlanPrice = maxPrice.toFixed(2);
  252 |     
  253 |     // Conditionally use force: true for Safari (webkit) to improve stability
  254 |     const isWebKit = this.page.context().browser().browserType().name() === 'webkit';
  255 |     await randomPlan.locator.click({ force: isWebKit });
  256 |     
  257 |     console.log(`✅ Selected plan: ${randomPlan.name}, Total Price: $${totalPlanPrice}`);
  258 | 
  259 |     // Handle Upsell
  260 |     let upsellPrice = null;
  261 |     // Use a broader locator for the checkbox since the exact text might change
  262 |     const upsellCheckbox = this.page.getByRole('checkbox').first();
  263 |     
  264 |     if (randomPlan.name !== 'Unlimited VIN Check') {
  265 |       const isVisible = await upsellCheckbox.isVisible().catch(() => false);
  266 |       if (isVisible) {
  267 |         const upsellContainer = upsellCheckbox.locator('xpath=..'); // Adjust if needed
  268 |         const upsellText = await upsellContainer.innerText();
  269 |         const upsellMatch = upsellText.match(/\$\d+(\.\d{2})?/);
  270 |         upsellPrice = upsellMatch ? upsellMatch[0].replace('$', '') : null;
  271 |         
  272 |         await upsellCheckbox.check({ force: true });
  273 |         console.log(`✅ Upsell selected. Price: $${upsellPrice}`);
  274 |       } else {
  275 |         console.log('ℹ️ Upsell not visible, skipping.');
  276 |       }
  277 |     } else {
  278 |       console.log('ℹ️ UVC plan selected: Upsell hidden.');
  279 |     }
  280 | 
  281 |     return { planName: randomPlan.name, totalPlanPrice, upsellPrice };
  282 |   }
  283 | 
  284 |   async validateOrderSummary(selectedData) {
  285 |     // Navigate to checkout if not already there
  286 |     if (!this.page.url().includes('/checkout')) {
  287 |       const checkoutButton = this.page.getByRole('button', { name: /proceed to checkout/i });
  288 |       await checkoutButton.waitFor({ state: 'visible', timeout: TIMEOUT });
  289 |       await checkoutButton.click({ force: true });
  290 |       await this.page.waitForURL(/.*\/checkout.*/);
  291 |     }
  292 | 
  293 |     // Locate Order Summary container
  294 |     const orderSummary = this.page.locator('aside:has(h2:has-text("Order summary"))');
  295 | 
  296 |     // Calculate expected total
  297 |     const planPrice = parseFloat(selectedData.totalPlanPrice);
  298 |     const upsellPrice = selectedData.upsellPrice ? parseFloat(selectedData.upsellPrice) : 0;
  299 |     const expectedTotal = planPrice + upsellPrice;
  300 | 
  301 |     // Validate Package
  302 |     // Refined to target the specific grid item containing the package name
  303 |     // Use a robust locator and handle the known typo "Unmimited" in the UI
  304 |     const packageItem = orderSummary.locator('div:has-text("Package") ~ div span').first();
  305 |     
  306 |     // Create a regex that handles the typo (matching Unlimited or Unmimited)
  307 |     const planNameRegex = selectedData.planName.replace('Unlimited', 'Un[lm]imited');
  308 |     await expect(packageItem).toHaveText(new RegExp(planNameRegex, 'i'));
  309 |     
  310 |     // DEBUG: Log all items in the order summary
  311 |     const summaryItems = await orderSummary.locator('div').allTextContents();
  312 |     console.log('DEBUG: Order summary items:', summaryItems);
  313 | 
  314 |     // Validate Total Price (specific selector from HTML)
  315 |     // Locate the span with 'Total' text, then find the span that contains '$' within the next sibling div
  316 |     const totalLocator = orderSummary.locator('span:has-text("Total") + div span').first();
  317 |     await totalLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  318 |     
  319 |     const totalText = await totalLocator.innerText();
  320 |     const foundTotal = parseFloat(totalText.replace('$', ''));
  321 |     
  322 |     // Compare with tolerance
  323 |     // NOTE: If upsell was NOT selected/visible in UI but added in Total, 
  324 |     // it implies the app adds it automatically based on some state, not just UI click.
  325 |     // For now, accept the total IF it matches either expectedTotal or expectedTotal + upsellPrice (if upsell exists in data)
  326 |     const expectedTotalNoUpsell = planPrice;
  327 |     
  328 |     const isMatch = Math.abs(foundTotal - expectedTotal) < 0.05 || Math.abs(foundTotal - expectedTotalNoUpsell) < 0.05;
  329 |     
> 330 |     expect(isMatch, `Total price mismatch. Expected $${expectedTotal} or $${expectedTotalNoUpsell}, found $${foundTotal}`).toBe(true);
      |                                                                                                                            ^ Error: Total price mismatch. Expected $109.94 or $99.95, found $69.98
  331 |     
  332 |     console.log(`✅ Total price $${foundTotal} verified in Order summary.`);
  333 | 
  334 |     // Validate Add-on (if applicable)
  335 |     if (selectedData.planName !== 'Unlimited VIN Check' && selectedData.upsellPrice) {
  336 |       // Specifically target the Add-on label to avoid strict mode violations
  337 |       const addonLabel = orderSummary.locator('div.inline-flex:has-text("Add-on")');
  338 |       await expect(addonLabel).toBeVisible();
  339 |       console.log('✅ Add-on verified in Order summary.');
  340 |     } else {
  341 |       await expect(orderSummary.locator('div:has-text("Add-on")')).not.toBeVisible();
  342 |       console.log('✅ No Add-on as expected for UVC.');
  343 |     }
  344 |   }
  345 | }
  346 | 
  347 | class EmailCache {
  348 |   constructor(page, timeout = TIMEOUT) {
  349 |     this.page = page;
  350 |     this.timeout = timeout;
  351 |     this.preview = new PreviewPage(page);
  352 |     this.validator = new PreviewToCheckoutPriceValidator(page);
  353 |   }
  354 | 
  355 |   async Cacheemailbackfromcheckout() {
  356 |     console.log("--- Starting TC_19 Email Cache Flow ---");
  357 |     
  358 |     // 1. Run checkout flow
  359 |     await this.preview.runCheckoutFlow();
  360 |     console.log("✅ Landed on checkout page (1st time)");
  361 | 
  362 |     // 2. Go back
  363 |     await this.page.goBack();
  364 |     await this.page.waitForLoadState('load');
  365 |     console.log("✅ Navigated back to Preview page");
  366 | 
  367 |     // 3. Select new plan
  368 |     const newData = await this.validator.selectRandomPlanAndHandleUpsell();
  369 |     
  370 |     // 4. Click Access Record (Expect NO email popup)
  371 |     await this.preview.clickAccessRecordButton();
  372 |     await this.page.waitForURL(/.*\/checkout.*/, { timeout: this.timeout });
  373 |     
  374 |     // Check that email popup is NOT visible
  375 |     const emailInput = this.page.locator('input[type="email"]');
  376 |     await expect(emailInput).not.toBeVisible({ timeout: 5000 });
  377 |     console.log("✅ Email popup did NOT appear, directly navigated");
  378 | 
  379 |     // 5. Validate Order Summary updated
  380 |     await this.validator.validateOrderSummary(newData);
  381 |     console.log("✅ Order summary updated correctly");
  382 |     
  383 |     return true;
  384 |   }
  385 | }
  386 | 
  387 | class DefaultPlanCheckingHandler {
  388 |   constructor(page) {
  389 |     this.page = page;
  390 |   }
  391 | 
  392 |   async sitesettingDefaultPlansVerifies(homeInstance, vin = '223870L108421', skipNavigation = false, planType = 'default') {
  393 |     if (!skipNavigation) {
  394 |       await homeInstance.navigate();
  395 |       await homeInstance.decodeVin(vin);
  396 |       await this.page.waitForURL(/.*\/preview.*/, { timeout: TIMEOUT });
  397 |     }
  398 | 
  399 |     // Ensure page is loaded before checking localStorage
  400 |     await this.page.waitForLoadState('domcontentloaded');
  401 | 
  402 |     // Wait for localStorage to be populated
  403 |     const siteSettings = await this.page.evaluate(async () => {
  404 |         for (let i = 0; i < 40; i++) {
  405 |             const val = localStorage.getItem('site_settings');
  406 |             if (val) return val;
  407 |             await new Promise(r => setTimeout(r, 500));
  408 |         }
  409 |         // DEBUG: Log all localStorage keys if not found
  410 |         const allKeys = Object.keys(localStorage);
  411 |         console.log(`DEBUG: localStorage keys (sitesetting): ${JSON.stringify(allKeys)}`);
  412 |         return null;
  413 |     });
  414 | 
  415 |     if (!siteSettings) throw new Error('site_settings not found in localStorage');
  416 | 
  417 |     const parsedSettings = JSON.parse(siteSettings);
  418 |     const targetPlanKey = planType === 'ws' ? 'default_ws_plan' : 'default_plan';
  419 |     const planData = parsedSettings[targetPlanKey];
  420 |     
  421 |     if (!planData) throw new Error(`${targetPlanKey} not found in site_settings`);
  422 |     
  423 |     console.log(`✅ Verified site_settings (${targetPlanKey}):`, planData);
  424 | 
  425 |     // Matching plan on UI - escape special characters in currency sign
  426 |     const escapedCurrency = planData.currency_sign.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  427 |     const planLocator = this.page.locator('div[role="button"]').filter({ 
  428 |         hasText: new RegExp(`${escapedCurrency}\\s*${planData.price}`) 
  429 |     }).first();
  430 |     
```