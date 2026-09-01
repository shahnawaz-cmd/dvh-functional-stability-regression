// tests/streaming-e2e.spec.js
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');
const { PreviewPage, PreviewToCheckoutPriceValidator, EmailCache, DefaultPlanCheckingHandler, UpsellTextMatched } = require('./pages/PreviewPage');
const { EUVinModifier } = require('./pages/EUVinModifier');
const { CheckoutPage } = require('./pages/CheckoutPage');
const { CouponFlowHandler, CheckoutCouponFlowTest, CouponFlowVerifier, CouponBannerHandler } = require('./pages/CouponFlowHandler');
const { ApiResponseCapture } = require('./helpers/responseCapture');
const { StreamingRevisitBannerTask, SafariRevisitBannerHelper } = require('./tasks/StreamingRevisitBannerTask');

const TIMEOUT = process.env.CI ? 90000 : 60000;



test.afterEach(async ({ page }) => {
  if (!page.isClosed()) {
    await page.close();
  }
});

test('TC_01_VIN_Decode_17_Character_Validation', async ({ page }) => {
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  await test.step('Navigate to Home', async () => {
    await home.navigate();
  });
  await test.step('Decode 17-Character VIN', async () => {
    await home.decodeVin('4JGED6EB0JA121898', 3);
  });
  await test.step('Verify Specs and Access Record Button', async () => {
    await preview.verifySpecsVisible();
    await preview.verifyAccessRecordButton();
  });
  await test.step('Interact with Access Record Popup', async () => {
    await preview.clickAccessRecordButton();
    await preview.closeAccessRecordPopup();
  });
  await page.close();
});

test('TC_02_VIN_Decode_Classic_Validation', async ({ page }) => {
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  await test.step('Navigate to Home', async () => {
    await home.navigate();
  });
  await test.step('Decode Classic VIN', async () => {
    await home.decodeVin('223870L108421');
  });
  await test.step('Verify Specs and Access Record Button', async () => {
    await preview.verifySpecsVisible('Records found for', 60000);
    await preview.verifyAccessRecordButton();
  });
  await test.step('Interact with Access Record Popup', async () => {
    await preview.clickAccessRecordButton();
    await preview.closeAccessRecordPopup();
  });
  await page.close();
});

test('TC_04_VHR_Revisit_Banner_Validation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'Mobile Safari' || testInfo.project.use.browserName === 'webkit', 'Skipping for Safari');
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  const revisitTask = new StreamingRevisitBannerTask();
  await test.step('Navigate & Decode VIN', async () => {
    await home.navigate();
    await home.decodeVin('1FA6P8CF0H5121898', 3);
  });
  await test.step('Perform Revisit Banner Task', async () => {
    await revisitTask.perform(page, preview, 'vhr');
  });
  await page.close();
});

test('TC_05_Window_Sticker_Revisit_Banner_Validation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'Mobile Safari' || testInfo.project.use.browserName === 'webkit', 'Skipping for Safari');
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  const revisitTask = new StreamingRevisitBannerTask();
  await test.step('Navigate to Window Sticker & Decode VIN', async () => {
    await home.navigateWindowSticker();
    await home.decodeVin('4JGED6EB0JA121898', 3);
  });
  await test.step('Perform Revisit Banner Task', async () => {
    await revisitTask.perform(page, preview, 'sticker');
  });
  await page.close();
});

test('TC_06_Preview_Page_Plan_Selection_Validation', async ({ page }) => {
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  await test.step('Navigate to Home & Decode VIN', async () => {
    await home.navigate();
    await home.decodeVin('4JGED6EB0JA121898', 3);
  });
  await test.step('Verify Specs Visible', async () => {
    await preview.verifySpecsVisible();
  });
  await test.step('Select each report plan and verify selection', async () => {
    const plans = ['1 Report', '2 Reports', '5 Reports', 'Unlimited VIN Check']; 
    for (const planName of plans) {
      const plan = await preview.selectPlan(planName);
      await expect(plan).toHaveAttribute('aria-pressed', 'true');
    }
  });
  await page.close();
});

test('TC_07_Exit_Intent_Popup_Trigger_Validation', async ({ page }, testInfo) => {
  test.skip(!!testInfo.project.use.isMobile, 'Skipping exit intent validation on mobile browsers');
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  await home.navigate();
  await home.decodeVin('4JGED6EB0JA121898', 3);
  await preview.verifySpecsVisible();
  await preview.triggerExitIntent();
  await preview.verifyAndRedeemExitOffer();
  await expect(page.getByText('% OFF')).toBeVisible({ timeout: 60000 });
  await expect(page).toHaveURL(/.*offer=.*/);
  await page.close();
});

// test('TC_08_Home_To_Checkout_Price_Coupon_And_Email_Cache_Validation', async ({ page }, testInfo) => {
//   const tcTimeout = process.env.CI ? 90000 : 60000;
//   test.setTimeout(tcTimeout);
// 
//   const home = new HomePage(page);
//   const preview = new PreviewPage(page);
//   const validator = new PreviewToCheckoutPriceValidator(page);
//   const couponVerifier = new CouponFlowVerifier(page);
//   const vin = '4JGED6EB0JA121898';
//   const couponCode = 'get20';
//   const couponPercentage = 0.20;
// 
//   // 1. Navigate & Decode VIN -> Preview
//   await home.navigate();
//   await home.decodeVin(vin, 3);
//   await preview.verifySpecsVisible();
// 
//   // 2. Select Initial Plan & Upsell on Preview Page
//   const initialPlan = await validator.selectRandomPlanAndHandleUpsell();
// 
//   // 3. Proceed to Checkout Form (Fills email popup on first visit)
//   await preview.runCheckoutFlow();
//   await expect(page).toHaveURL(/.*\/checkout.*/);
// 
//   // 4. Validate Initial Order Summary (Plan + Upsell match checkout)
//   await validator.validateOrderSummary(initialPlan);
// 
//   // 5. Apply Promo Coupon ('get20' = 20% off) & Validate Discounted Total
//   const couponSummary = await couponVerifier.applyAndVerifyCoupon(couponCode, couponPercentage);
// 
//   // 6. Email Cache & Revisit Flow: Go Back to Preview
//   await page.goBack();
//   await page.waitForLoadState('domcontentloaded');
//   await preview.verifySpecsVisible();
// 
//   // Verify email/session cookie persistence
//   const cookies = await page.context().cookies();
//   const cachedCookie = cookies.find(c => /email|session|user|cart/i.test(c.name) || c.value.includes('@'));
//   console.log(`ℹ️ [TC_08] Email cache cookie verified: ${cachedCookie ? cachedCookie.name : 'Session Active'}`);
// 
//   // 7. Select a New Plan on Preview
//   const newPlan = await validator.selectRandomPlanAndHandleUpsell();
// 
//   // 8. Click Access Record (Verify email popup is SKIPPED because email is cached)
//   await preview.clickAccessRecordButton();
//   await page.waitForURL(/.*\/checkout.*/, { timeout: tcTimeout });
// 
//   // Ensure email popup did not appear
//   const emailInput = page.locator('input[type="email"]');
//   await expect(emailInput).not.toBeVisible({ timeout: 3000 });
//   console.log('✅ [TC_08] Email popup did NOT appear (cached directly to checkout)');
// 
//   // 9. Re-validate Checkout Order Summary for the New Plan
//   await validator.validateOrderSummary(newPlan);
// 
//   // 10. Report Stdout & HTML JSON Attachment
//   const reportData = {
//     vin,
//     initialPlan,
//     couponSummary,
//     cachedEmailFlow: {
//       cookieSaved: !!cachedCookie,
//       popupSkipped: true,
//       newPlanSelected: newPlan
//     }
//   };
// 
//   console.log(`\n📋 [TC_08] Full Checkout, Coupon & Email Cache Summary:\n`, JSON.stringify(reportData, null, 2));
//   await testInfo.attach('TC_08_Full_Checkout_Price_Coupon_Email_Cache_Summary', {
//     body: JSON.stringify(reportData, null, 2),
//     contentType: 'application/json',
//   });
// 
//   await page.close();
// });

// test('TC_09_Full_Checkout_Flow_Stripe_Visa_US_Validation', async ({ page }, testInfo) => {
//   const home = new HomePage(page);
//   const preview = new PreviewPage(page);
//   const checkout = new CheckoutPage(page);
//   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
//   await home.navigate();
//   await home.decodeVin('4JGED6EB0JA121898', 3);
//   await preview.verifySpecsVisible();
//   await preview.runCheckoutFlow();
//   await expect(page).toHaveURL(/.*\/checkout.*/);
//   await Promise.all([
//     checkout.completeCheckoutProcess('visa_us'),
//     page.waitForURL(/.*\/success.*/, { timeout: TIMEOUT }),
//     apiCapture.waitForStripePaymentIntent(),
//     apiCapture.waitForPaymentUpdate(),
//   ]);
//   await page.waitForURL(/.*\/dashboard\?vin=[^&]+&generate=true&paid=true#vehicle-history-report/, { timeout: TIMEOUT });
//   await page.close();
// });

// test('TC_10_Full_Window_Sticker_Checkout_Flow_Stripe_Visa_US_Validation', async ({ page }, testInfo) => {
//   const home = new HomePage(page);
//   const preview = new PreviewPage(page);
//   const checkout = new CheckoutPage(page);
//   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
//   const vin = process.env.TC_10_VIN || '4JGED6EB0JA121264';
//   await page.goto('/window-sticker');
//   await home.decodeVin(vin, 3);
//   await preview.verifySpecsVisible('Window sticker found for');
//   await preview.runCheckoutFlow();
//   await expect(page).toHaveURL(/.*\/checkout.*/);
//   await Promise.all([
//     checkout.completeCheckoutProcess('visa_us'),
//     page.waitForURL(/.*\/success.*/, { timeout: TIMEOUT }),
//     apiCapture.waitForStripePaymentIntent(),
//     apiCapture.waitForPaymentUpdate(),
//   ]);
//   await page.waitForURL(/.*\/dashboard\?vin=[^&]+&generate=true&paid=true#window-sticker/, { timeout: TIMEOUT });
//   await page.close();
// });

// test('TC_11_Full_Checkout_Flow_Stripe_Generic_Decline_Validation', async ({ page }, testInfo) => {
//   const home = new HomePage(page);
//   const preview = new PreviewPage(page);
//   const checkout = new CheckoutPage(page);
//   await home.navigate();
//   await home.decodeVin('4JGED6EB0JA121898', 3);
//   await preview.verifySpecsVisible();
//   await preview.runCheckoutFlow();
//   await expect(page).toHaveURL(/.*\/checkout.*/);
//   await Promise.all([
//     checkout.completeCheckoutProcess('generic_decline'),
//     checkout.waitForPaymentFailureAndClose(),
//   ]);
//   await expect(page).not.toHaveURL(/.*\/success.*/);
//   await page.close();
// });

// test('TC_12_Full_Checkout_Flow_Stripe_3DS_Validation', async ({ page }, testInfo) => {
//   const home = new HomePage(page);
//   const preview = new PreviewPage(page);
//   const checkout = new CheckoutPage(page);
//   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
//   await home.navigate();
//   await home.decodeVin('4JGED6EB0JA121898', 3);
//   await preview.verifySpecsVisible();
//   await preview.runCheckoutFlow();
//   await expect(page).toHaveURL(/.*\/checkout.*/);
//   await Promise.all([
//     checkout.completeCheckoutProcess('stripe_3ds'),
//     apiCapture.waitForStripePaymentIntent(),
//     apiCapture.waitForThreeDSAuthenticate(),
//   ]);
//   await Promise.all([
//     checkout.complete3DSChallenge(),
//     page.waitForURL(/.*\/(success|success-page).*/, { timeout: TIMEOUT }),
//   ]);
//   await expect(page).toHaveURL(/.*\/(success|success-page).*/);
//   await page.close();
// });

// Pool of Classic mapped VINs
const CLASSIC_MAPPED_VINS = [
  'XP29G72104639',
  'M176103674',
  '3N67K5M340214',
  '1H57H5Z447879',
  '242378Z126752',
  'PH27G62105038',
  'CL41M3C146664'
];

// Helper to pick a random Classic VIN and randomize its last 4 characters
const getRandomizedClassicVin = () => {
  const baseVin = CLASSIC_MAPPED_VINS[Math.floor(Math.random() * CLASSIC_MAPPED_VINS.length)];
  const chars = baseVin.split('');
  const digits = '0123456789';
  for (let i = chars.length - 4; i < chars.length; i++) {
    chars[i] = digits[Math.floor(Math.random() * digits.length)];
  }
  return chars.join('');
};

test('TC_13_Classic_VIN_YMM_Edit_Validation', async ({ page, context }, testInfo) => {
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  const classicVin = getRandomizedClassicVin();
  try {
    await context.clearCookies();
    await context.clearPermissions();
    await home.navigate();
    await home.decodeVin(classicVin);
    await page.waitForURL(/.*\/preview.*/);
    await preview.verifySpecsVisible('Records found for', 60000);
    const selectedYMM = await preview.classicEdtibleFeatureYMM();

    console.log(`\n📋 [TC_13] Classic YMM Selected Dropdowns:\nVIN: ${classicVin}\n${JSON.stringify(selectedYMM, null, 2)}\n`);
    await testInfo.attach('TC_13_Selected_YMM_Data', {
      body: JSON.stringify({ vin: classicVin, ...selectedYMM }, null, 2),
      contentType: 'application/json',
    });

    // Wait 5s+ for frontend to fully update with the modified data
    await page.waitForTimeout(5000);

    // Capture screenshot of the updated frontend and attach to report
    const ss13 = await page.screenshot({ fullPage: false });
    await testInfo.attach('TC_13_Updated_Frontend_Screenshot', {
      body: ss13,
      contentType: 'image/png',
    });
  } finally {
    await page.close();
  }
});

test('TC_14_Classic_Manual_Input_Validation', async ({ page, context }, testInfo) => {
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  const classicVin = getRandomizedClassicVin();
  try {
    await context.clearCookies();
    await context.clearPermissions();
    await home.navigate();
    await home.decodeVin(classicVin);
    await page.waitForURL(/.*\/preview.*/);
    await preview.verifySpecsVisible('Records found for', 60000);
    const specs = await preview.ClassicEditibleSpecsManualInput();
    
    console.log(`\n📋 [TC_14] Manual Classic Specs Input:\nVIN: ${classicVin}\n${JSON.stringify(specs, null, 2)}\n`);
    await testInfo.attach('TC_14_Manual_Specs_Data', {
      body: JSON.stringify({ vin: classicVin, ...specs }, null, 2),
      contentType: 'application/json',
    });

    // Wait 5s+ for frontend to fully update with the modified data
    await page.waitForTimeout(5000);

    // Capture screenshot of the updated frontend and attach to report
    const ss14 = await page.screenshot({ fullPage: false });
    await testInfo.attach('TC_14_Updated_Frontend_Screenshot', {
      body: ss14,
      contentType: 'image/png',
    });
  } finally {
    await page.close();
  }
});

test('TC_15_Classic_Editible_Specs_Update', async ({ page, context }, testInfo) => {
  const home = new HomePage(page);
  const preview = new PreviewPage(page);
  const classicVin = getRandomizedClassicVin();

  try {
    await context.clearCookies();
    await context.clearPermissions();
    await home.navigate();
    await home.decodeVin(classicVin);
    await page.waitForURL(/.*\/preview.*/);
    await preview.verifySpecsVisible('Records found for', 60000);
    const specs = await preview.classicEditibleSpecsUpdateSpec();
    
    console.log(`\n📋 [TC_15] Classic Editable Specs Update:\nVIN: ${classicVin}\n${JSON.stringify(specs, null, 2)}\n`);
    await testInfo.attach('TC_15_Updated_Specs_Data', {
      body: JSON.stringify({ vin: classicVin, ...specs }, null, 2),
      contentType: 'application/json',
    });

    // Wait 5s+ for frontend to fully update with the modified data
    await page.waitForTimeout(5000);

    // Capture screenshot of the updated frontend and attach to report
    const ss15 = await page.screenshot({ fullPage: false });
    await testInfo.attach('TC_15_Updated_Frontend_Screenshot', {
      body: ss15,
      contentType: 'image/png',
    });
  } finally {
    await page.close();
  }
});

// test('TC_16_PayPal_Successful_Payment', async ({ page, context }) => {
//   const home = new HomePage(page);
//   const preview = new PreviewPage(page);
//   const checkout = new CheckoutPage(page);
//   await home.navigate();
//   await home.decodeVin('4JGED6EB0JA121898', 3);
//   await preview.runCheckoutFlow();
//   await checkout.paypal.selectPayPalOption();
//   await page.waitForTimeout(4000);
//   const popup = await checkout.paypal.clickPayPalButton(context, TIMEOUT);
//   await checkout.paypal.loginPayPal(popup, {email: process.env.PAYPAL_EMAIL, password: process.env.PAYPAL_PASSWORD}, TIMEOUT);
//   await checkout.paypal.approvePayPalPayment(popup, TIMEOUT);
//   await page.waitForURL(url => url.toString().includes('paid=true'), { timeout: 60000 });
//   await page.close();
// });

test('TC_17_EU_VIN_Confirmation_No', async ({ page }) => {
  const home = new HomePage(page);
  const modifier = new EUVinModifier(page);
  await home.navigate();
  await home.decodeVin('SHHEU88701U002018', 3);
  await modifier.modifyEUVinByYMMUsingNo();
  await page.close();
});


test('TC_20_Default_Plan_Checking', async ({ page }) => {
  const tcTimeout = process.env.CI ? 120000 : 60000;
  test.setTimeout(tcTimeout);
  const home = new HomePage(page);
  const handler = new DefaultPlanCheckingHandler(page);
  await handler.sitesettingDefaultPlansVerifies(home);
  await page.close();
});

test('TC_21_Window_Sticker_Default_Plan', async ({ page }) => {
  const tcTimeout = process.env.CI ? 120000 : 60000;
  test.setTimeout(tcTimeout);
  const home = new HomePage(page);
  const handler = new DefaultPlanCheckingHandler(page);
  await home.navigateWindowSticker();
  await home.decodeVin('4JGED6EB0JA121264');
  await page.waitForURL(/.*\/preview.*/, { timeout: tcTimeout }).catch(() => {});
  await handler.sitesettingDefaultPlansVerifies(home, '4JGED6EB0JA121264', true, 'ws');
  await page.close();
});

test('TC_22_VHR_Upsell_Text_Validation', async ({ page }) => {
  const tcTimeout = process.env.CI ? 120000 : 60000;
  test.setTimeout(tcTimeout);
  const home = new HomePage(page);
  const upsellHandler = new UpsellTextMatched(page);
  await home.navigate();
  await home.decodeVin('4JGED6EB0JA121898', 3);
  await page.waitForURL(/.*\/preview.*/, { timeout: tcTimeout }).catch(() => {});
  await upsellHandler.upsellTextVerify('vhr', tcTimeout);
  await page.close();
});

test('TC_23_Sticker_Upsell_Text_Validation', async ({ page }) => {
  const tcTimeout = process.env.CI ? 120000 : 60000;
  test.setTimeout(tcTimeout);
  const home = new HomePage(page);
  const upsellHandler = new UpsellTextMatched(page);
  await home.navigateWindowSticker();
  await home.decodeVin('4JGED6EB0JA121264');
  await page.waitForURL(/.*\/preview.*/, { timeout: tcTimeout }).catch(() => {});
  await upsellHandler.upsellTextVerify('sticker', tcTimeout);
  await page.close();
});

test('TC_24_Coupon_Banner_Hierarchy_And_Persistence_Validation', async ({ page }, testInfo) => {
  const tcTimeout = process.env.CI ? 60000 : 30000;
  test.setTimeout(tcTimeout);

  const bannerHandler = new CouponBannerHandler(page);
  const result = await bannerHandler.verifyHierarchyAndPersistence(testInfo);

  console.log(`\n📋 [TC_24] Coupon Banner & Cookie Verification:\n`, JSON.stringify(result, null, 2));
  await testInfo.attach('TC_24_Coupon_Banner_Summary', {
    body: JSON.stringify(result, null, 2),
    contentType: 'application/json',
  });

  await page.close();
});

