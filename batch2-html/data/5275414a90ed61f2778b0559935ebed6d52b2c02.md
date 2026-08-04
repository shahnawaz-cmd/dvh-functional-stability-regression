# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_14_Classic_Manual_Input_Validation
- Location: tests/streaming2-e2e.spec.js:245:1

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForURL: Target page, context or browser has been closed
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "https://detailedvehiclehistory.com/?vin=242370B111343"
============================================================
```

# Test source

```ts
  151 | //   const home = new HomePage(page);
  152 | //   const preview = new PreviewPage(page);
  153 | //   const checkout = new CheckoutPage(page);
  154 | //   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
  155 | //   await home.navigate();
  156 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  157 | //   await preview.verifySpecsVisible();
  158 | //   await preview.runCheckoutFlow();
  159 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  160 | //   await Promise.all([
  161 | //     checkout.completeCheckoutProcess('visa_us'),
  162 | //     page.waitForURL(/.*\/success.*/, { timeout: TIMEOUT }),
  163 | //     apiCapture.waitForStripePaymentIntent(),
  164 | //     apiCapture.waitForPaymentUpdate(),
  165 | //   ]);
  166 | //   await page.waitForURL(/.*\/dashboard\?vin=[^&]+&generate=true&paid=true#vehicle-history-report/, { timeout: TIMEOUT });
  167 | //   await page.close();
  168 | // });
  169 | 
  170 | // test('TC_10_Full_Window_Sticker_Checkout_Flow_Stripe_Visa_US_Validation', async ({ page }, testInfo) => {
  171 | //   const home = new HomePage(page);
  172 | //   const preview = new PreviewPage(page);
  173 | //   const checkout = new CheckoutPage(page);
  174 | //   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
  175 | //   const vin = process.env.TC_10_VIN || '4JGED6EB0JA121264';
  176 | //   await page.goto('/window-sticker');
  177 | //   await home.decodeVin(vin, 3);
  178 | //   await preview.verifySpecsVisible('Window sticker found for');
  179 | //   await preview.runCheckoutFlow();
  180 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  181 | //   await Promise.all([
  182 | //     checkout.completeCheckoutProcess('visa_us'),
  183 | //     page.waitForURL(/.*\/success.*/, { timeout: TIMEOUT }),
  184 | //     apiCapture.waitForStripePaymentIntent(),
  185 | //     apiCapture.waitForPaymentUpdate(),
  186 | //   ]);
  187 | //   await page.waitForURL(/.*\/dashboard\?vin=[^&]+&generate=true&paid=true#window-sticker/, { timeout: TIMEOUT });
  188 | //   await page.close();
  189 | // });
  190 | 
  191 | // test('TC_11_Full_Checkout_Flow_Stripe_Generic_Decline_Validation', async ({ page }, testInfo) => {
  192 | //   const home = new HomePage(page);
  193 | //   const preview = new PreviewPage(page);
  194 | //   const checkout = new CheckoutPage(page);
  195 | //   await home.navigate();
  196 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  197 | //   await preview.verifySpecsVisible();
  198 | //   await preview.runCheckoutFlow();
  199 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  200 | //   await Promise.all([
  201 | //     checkout.completeCheckoutProcess('generic_decline'),
  202 | //     checkout.waitForPaymentFailureAndClose(),
  203 | //   ]);
  204 | //   await expect(page).not.toHaveURL(/.*\/success.*/);
  205 | //   await page.close();
  206 | // });
  207 | 
  208 | // test('TC_12_Full_Checkout_Flow_Stripe_3DS_Validation', async ({ page }, testInfo) => {
  209 | //   const home = new HomePage(page);
  210 | //   const preview = new PreviewPage(page);
  211 | //   const checkout = new CheckoutPage(page);
  212 | //   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
  213 | //   await home.navigate();
  214 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  215 | //   await preview.verifySpecsVisible();
  216 | //   await preview.runCheckoutFlow();
  217 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  218 | //   await Promise.all([
  219 | //     checkout.completeCheckoutProcess('stripe_3ds'),
  220 | //     apiCapture.waitForStripePaymentIntent(),
  221 | //     apiCapture.waitForThreeDSAuthenticate(),
  222 | //   ]);
  223 | //   await Promise.all([
  224 | //     checkout.complete3DSChallenge(),
  225 | //     page.waitForURL(/.*\/(success|success-page).*/, { timeout: TIMEOUT }),
  226 | //   ]);
  227 | //   await expect(page).toHaveURL(/.*\/(success|success-page).*/);
  228 | //   await page.close();
  229 | // });
  230 | 
  231 | test('TC_13_Classic_VIN_YMM_Edit_Validation', async ({ page }) => {
  232 |   const home = new HomePage(page);
  233 |   const preview = new PreviewPage(page);
  234 |   try {
  235 |     await home.navigate();
  236 |     await home.decodeVin('242370B111346');
  237 |     await page.waitForURL(/.*\/preview.*/);
  238 |     await preview.verifySpecsVisible('Records found for', 60000);
  239 |     await preview.classicEdtibleFeatureYMM();
  240 |   } finally {
  241 |     await page.close();
  242 |   }
  243 | });
  244 | 
  245 | test('TC_14_Classic_Manual_Input_Validation', async ({ page }) => {
  246 |   const home = new HomePage(page);
  247 |   const preview = new PreviewPage(page);
  248 |   try {
  249 |     await home.navigate();
  250 |     await home.decodeVin('242370B111346');
> 251 |     await page.waitForURL(/.*\/preview.*/);
      |                ^ Error: page.waitForURL: Target page, context or browser has been closed
  252 |     await preview.verifySpecsVisible('Records found for', 60000);
  253 |     await preview.ClassicEditibleSpecsManualInput();
  254 |   } finally {
  255 |     await page.close();
  256 |   }
  257 | });
  258 | 
  259 | test('TC_15_Classic_Editible_Specs_Update', async ({ page }) => {
  260 |   const home = new HomePage(page);
  261 |   const preview = new PreviewPage(page);
  262 |   try {
  263 |     await home.navigate();
  264 |     await home.decodeVin('242370B111346');
  265 |     await page.waitForURL(/.*\/preview.*/);
  266 |     await preview.verifySpecsVisible('Records found for', 60000);
  267 |     await preview.classicEditibleSpecsUpdateSpec();
  268 |   } finally {
  269 |     await page.close();
  270 |   }
  271 | });
  272 | 
  273 | // test('TC_16_PayPal_Successful_Payment', async ({ page, context }) => {
  274 | //   const home = new HomePage(page);
  275 | //   const preview = new PreviewPage(page);
  276 | //   const checkout = new CheckoutPage(page);
  277 | //   await home.navigate();
  278 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  279 | //   await preview.runCheckoutFlow();
  280 | //   await checkout.paypal.selectPayPalOption();
  281 | //   await page.waitForTimeout(4000);
  282 | //   const popup = await checkout.paypal.clickPayPalButton(context, TIMEOUT);
  283 | //   await checkout.paypal.loginPayPal(popup, {email: process.env.PAYPAL_EMAIL, password: process.env.PAYPAL_PASSWORD}, TIMEOUT);
  284 | //   await checkout.paypal.approvePayPalPayment(popup, TIMEOUT);
  285 | //   await page.waitForURL(url => url.toString().includes('paid=true'), { timeout: 60000 });
  286 | //   await page.close();
  287 | // });
  288 | 
  289 | test('TC_17_EU_VIN_Confirmation_No', async ({ page }) => {
  290 |   const home = new HomePage(page);
  291 |   const modifier = new EUVinModifier(page);
  292 |   await home.navigate();
  293 |   await home.decodeVin('SHHEU88701U002018', 3);
  294 |   await modifier.modifyEUVinByYMMUsingNo();
  295 |   await page.close();
  296 | });
  297 | 
  298 | // test('TC_18_Price_Consistency_Validation', async ({ page }) => {
  299 | //   const home = new HomePage(page);
  300 | //   const preview = new PreviewPage(page);
  301 | //   const validator = new PreviewToCheckoutPriceValidator(page);
  302 | //   await home.navigate();
  303 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  304 | //   const selectedPlan = await validator.selectRandomPlanAndHandleUpsell();
  305 | //   await preview.runCheckoutFlow();
  306 | //   await validator.validateOrderSummary(selectedPlan);
  307 | //   await page.close();
  308 | // });
  309 | 
  310 | // test('TC_19_Email_Cache_Flow', async ({ page }) => {
  311 | //   const tcTimeout = 120000;
  312 | //   test.setTimeout(tcTimeout);
  313 | //   const home = new HomePage(page);
  314 | //   const cache = new EmailCache(page, tcTimeout);
  315 | //   await home.navigate();
  316 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  317 | //   await cache.Cacheemailbackfromcheckout();
  318 | //   await page.close();
  319 | // });
  320 | 
  321 | test('TC_20_Default_Plan_Checking', async ({ page }) => {
  322 |   const tcTimeout = process.env.CI ? 120000 : 60000;
  323 |   test.setTimeout(tcTimeout);
  324 |   const home = new HomePage(page);
  325 |   const handler = new DefaultPlanCheckingHandler(page);
  326 |   await handler.sitesettingDefaultPlansVerifies(home);
  327 |   await page.close();
  328 | });
  329 | 
  330 | test('TC_21_Window_Sticker_Default_Plan', async ({ page }) => {
  331 |   const tcTimeout = process.env.CI ? 120000 : 60000;
  332 |   test.setTimeout(tcTimeout);
  333 |   const home = new HomePage(page);
  334 |   const handler = new DefaultPlanCheckingHandler(page);
  335 |   await page.goto('/window-sticker');
  336 |   await home.decodeVin('4JGED6EB0JA121264');
  337 |   await handler.sitesettingDefaultPlansVerifies(home, '4JGED6EB0JA121264', true, 'ws');
  338 |   await page.close();
  339 | });
  340 | 
  341 | test('TC_22_VHR_Upsell_Text_Validation', async ({ page }) => {
  342 |   const tcTimeout = process.env.CI ? 120000 : 60000;
  343 |   test.setTimeout(tcTimeout);
  344 |   const home = new HomePage(page);
  345 |   const upsellHandler = new UpsellTextMatched(page);
  346 |   await home.navigate();
  347 |   await home.decodeVin('4JGED6EB0JA121898', 3);
  348 |   await page.waitForURL(/.*\/preview.*/, { timeout: tcTimeout });
  349 |   await upsellHandler.upsellTextVerify('vhr', tcTimeout);
  350 |   await page.close();
  351 | });
```