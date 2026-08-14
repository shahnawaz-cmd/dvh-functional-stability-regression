// non_streaming_flow/nonstreaming.spec.js
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../tests/pages/HomePage');

const { CalculateVinDecodeTimeTask } = require('./tasks/CalculateVinDecodeTimeTask');

// Non-Streaming Main Test Suite
test.describe('Non-Streaming Main Test Suite', () => {

  test('TC_NS_01_Non_Streaming_17_Character_VIN_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming 17-Character VIN Decode Task ---');
    const home = new HomePage(page);
    await home.navigate();
    
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`Successfully decoded 17-character VIN in non-streaming flow (${durationSeconds}s): ${vin}`);
  });

  test('TC_NS_02_Non_Streaming_Classic_VIN_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Classic VIN Decode Task ---');
    const home = new HomePage(page);
    await home.navigate();

    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isClassic: true });
    
    await expect(page).toHaveURL(/.*(preview|report).*/i);
    console.log(`Successfully decoded Classic VIN in non-streaming flow (${durationSeconds}s) and verified preview page: ${vin}`);
  });

  test('TC_NS_03_Non_Streaming_EU_VIN_Confirmation_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming EU VIN Confirmation Task ---');
    const home = new HomePage(page);
    await home.navigate();

    const { NonStreamingEuVinConfirmationTask } = require('./tasks/NonStreamingEuVinConfirmationTask');
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isEU: true, skipSuccessClick: true });

    const euConfirmationTask = new NonStreamingEuVinConfirmationTask();
    await euConfirmationTask.perform(page);

    await expect(page).toHaveURL(/.*(preview|report).*/i);
    console.log(`Successfully completed EU VIN confirmation in non-streaming flow (${durationSeconds}s): ${vin}`);
  });

  test('TC_NS_04_Non_Streaming_Revisit_Banner_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Revisit Banner Flow Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. VIN Decode to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`Initial VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Execute Revisit Banner Task (browser back & click 'Grab it for' button)
    const { NonStreamingRevisitBannerTask } = require('./tasks/NonStreamingRevisitBannerTask');
    const revisitTask = new NonStreamingRevisitBannerTask();
    await revisitTask.perform(page);

    console.log('Successfully completed Revisit Banner Validation in non-streaming flow');
  });

  test('TC_NS_05_Non_Streaming_Revisit_Banner_Sticker_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Revisit Banner (Window Sticker) Flow Task ---');
    
    // 1. Navigate to /window-sticker page path relative to baseURL
    await page.goto('/window-sticker');

    // 2. VIN Decode on /window-sticker to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`Initial Window Sticker VIN decoded (${durationSeconds}s): ${vin}`);

    // 3. Execute Revisit Banner Task (browser back to /window-sticker & click 'Grab it' button)
    const { NonStreamingRevisitBannerTask } = require('./tasks/NonStreamingRevisitBannerTask');
    const revisitTask = new NonStreamingRevisitBannerTask();
    await revisitTask.perform(page);

    console.log('Successfully completed Revisit Banner (Window Sticker) Validation in non-streaming flow');
  });

  test('TC_NS_06_Non_Streaming_Exit_Intent_Popup_Preview_Validation', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Exit intent pop-up test is desktop mouse-leave only; skipping on mobile devices.');
    console.log('--- Executing Non-Streaming Exit Intent Pop-up Preview Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. VIN Decode to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`Initial VIN decoded to land on Preview page (${durationSeconds}s): ${vin}`);

    // 2. Execute Exit Intent Pop-up Task on Preview Page
    const { NonStreamingExitIntentPopupTask } = require('./tasks/NonStreamingExitIntentPopupTask');
    const exitIntentTask = new NonStreamingExitIntentPopupTask();
    await exitIntentTask.perform(page);

    await expect(page).toHaveURL(/.*(preview|report).*/i);
    console.log('Successfully completed Exit Intent Pop-up Preview Validation in non-streaming flow');
  });

  test('TC_NS_07_Non_Streaming_Classic_Editable_Specs_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Classic Editable Specs Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. Decode Classic VIN to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isClassic: true });
    console.log(`Classic VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Execute Classic Editable Specs Task
    const { NonStreamingClassicEditableSpecsTask } = require('./tasks/NonStreamingClassicEditableSpecsTask');
    const classicSpecsTask = new NonStreamingClassicEditableSpecsTask();
    await classicSpecsTask.perform(page);

    console.log('Successfully completed Classic Editable Specs Validation in non-streaming flow');
  });

  test('TC_NS_08_Non_Streaming_Classic_Editable_Specs_Manual_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Classic Editable Specs Manual Update Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. Decode Classic VIN to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isClassic: true });
    console.log(`Classic VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Execute Classic Editable Specs Manual Task
    const { NonStreamingClassicEditableSpecsManualTask } = require('./tasks/NonStreamingClassicEditableSpecsManualTask');
    const manualTask = new NonStreamingClassicEditableSpecsManualTask();
    await manualTask.perform(page);

    console.log('Successfully completed Classic Editable Specs Manual Validation in non-streaming flow');
  });

  test('TC_NS_09_Non_Streaming_Default_Plan_Price_Check', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Default Plan Price Check Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. Decode VIN to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Execute Default Plan Price Check Task
    const { NonStreamingDefaultPlanPriceCheckTask } = require('./tasks/NonStreamingDefaultPlanPriceCheckTask');
    const priceTask = new NonStreamingDefaultPlanPriceCheckTask();
    await priceTask.perform(page);

    console.log('Successfully completed Default Plan Price Check Validation in non-streaming flow');
  });

  test('TC_NS_10_Non_Streaming_Default_Plan_Price_Check_Sticker', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Default Plan Price Check (Window Sticker) Task ---');
    
    // 1. Navigate to /window-sticker page path relative to baseURL
    await page.goto('/window-sticker');

    // 2. Decode VIN on /window-sticker to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`Window Sticker VIN decoded (${durationSeconds}s): ${vin}`);

    // 3. Execute Default Plan Price Check Task
    const { NonStreamingDefaultPlanPriceCheckTask } = require('./tasks/NonStreamingDefaultPlanPriceCheckTask');
    const priceTask = new NonStreamingDefaultPlanPriceCheckTask();
    await priceTask.perform(page);

    console.log('Successfully completed Default Plan Price Check (Window Sticker) Validation in non-streaming flow');
  });

  test('TC_NS_11_Non_Streaming_Classic_Editable_Specs_Only_Validation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Classic Editable Specifications Only Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. Decode Classic VIN to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isClassic: true });
    console.log(`Classic VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Execute Classic Editable Specs Only Task
    const { NonStreamingClassicEditableSpecsOnlyTask } = require('./tasks/NonStreamingClassicEditableSpecsOnlyTask');
    const specsOnlyTask = new NonStreamingClassicEditableSpecsOnlyTask();
    await specsOnlyTask.perform(page);

    console.log('Successfully completed Classic Editable Specifications Only Validation in non-streaming flow');
  });

  test('TC_NS_12_Non_Streaming_Upsell_Text_Match', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Upsell Text & Price Match Task ---');
    const home = new HomePage(page);
    await home.navigate();

    // 1. Decode VIN to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Execute Upsell Text Match Task directly on Preview Page
    const { NonStreamingUpsellTextMatchTask } = require('./tasks/NonStreamingUpsellTextMatchTask');
    const upsellTask = new NonStreamingUpsellTextMatchTask();
    await upsellTask.perform(page, 'vhr');

    console.log('Successfully completed Upsell Text Match Validation in non-streaming flow');
  });

  test('TC_NS_13_Non_Streaming_Upsell_Text_Match_Sticker', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Window Sticker Upsell Text & Price Match Task ---');
    
    // 1. Navigate to /window-sticker
    await page.goto('/window-sticker');
    await page.waitForLoadState('domcontentloaded');

    // 2. Decode VIN to land on Window Sticker Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`VIN decoded (${durationSeconds}s): ${vin}`);

    // 3. Execute Upsell Text Match Task for sticker flow
    const { NonStreamingUpsellTextMatchTask } = require('./tasks/NonStreamingUpsellTextMatchTask');
    const upsellTask = new NonStreamingUpsellTextMatchTask();
    await upsellTask.perform(page, 'sticker');

    console.log('Successfully completed Window Sticker Upsell Text Match Validation in non-streaming flow');
  });

  test('TC_NS_14_Non_Streaming_Preview_To_Checkout_Redirection', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Preview To Checkout Redirection Task ---');
    await page.goto('https://dvh.vehiclehistory.report/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Decode US VIN to land on Preview page
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isClassic: false });
    console.log(`US VIN decoded (${durationSeconds}s): ${vin}`);

    // 2. Select Random Plan and Handle Upsell on Preview page
    const { NonStreamingSelectRandomPlanAndHandleUpsellTask } = require('./tasks/NonStreamingSelectRandomPlanAndHandleUpsellTask');
    const planUpsellTask = new NonStreamingSelectRandomPlanAndHandleUpsellTask();
    const planData = await planUpsellTask.perform(page);
    console.log(`Selected plan details: ${JSON.stringify(planData)}`);

    // 3. Perform Checkout Time Calculation Task (fill email & click proceed)
    const { CalculateCheckoutTimeTask } = require('./tasks/CalculateCheckoutTimeTask');
    const { durationSeconds: checkoutSeconds, checkoutUrl } = await CalculateCheckoutTimeTask.execute(page);

    // 4. Validate dynamic plan price + upsell total on Checkout page DOM
    const { NonStreamingCheckoutPriceValidatorTask } = require('./tasks/NonStreamingCheckoutPriceValidatorTask');
    const priceValidatorTask = new NonStreamingCheckoutPriceValidatorTask();
    await priceValidatorTask.perform(page, planData);

    console.log(`Successfully completed Preview to Checkout Redirection (${checkoutSeconds}s) and Checkout Price Validation in non-streaming flow`);
  });

  /*
  test('TC_NS_08_Non_Streaming_Coupon_Verification', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Coupon Verification Task ---');
    const { NonStreamingCouponFlowTask } = require('./tasks/NonStreamingCouponFlowTask');
    const couponTask = new NonStreamingCouponFlowTask();
    await couponTask.verifyCoupon(page, 'preview15', '15%');
  });

  test('TC_NS_09_Non_Streaming_Low_To_High_Coupon_Flow', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Low to High Coupon Flow Task ---');
    const { NonStreamingCouponFlowTask } = require('./tasks/NonStreamingCouponFlowTask');
    const couponTask = new NonStreamingCouponFlowTask();
    await couponTask.verifyLowToHighCouponFlow(page);
  });

  test('TC_NS_10_Non_Streaming_Coupon_Banner_Persistence', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Coupon Banner Persistence Task ---');
    const { NonStreamingCouponFlowTask } = require('./tasks/NonStreamingCouponFlowTask');
    const couponTask = new NonStreamingCouponFlowTask();
    await couponTask.verifyCouponBannerOnOtherPages(page);
  });
  */
});
