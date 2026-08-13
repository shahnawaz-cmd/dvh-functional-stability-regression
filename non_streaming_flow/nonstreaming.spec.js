// non_streaming_flow/nonstreaming.spec.js
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../tests/pages/HomePage');

const { CalculateVinDecodeTimeTask } = require('./tasks/CalculateVinDecodeTimeTask');

// Non-Streaming Main Test Suite
test.describe('Non-Streaming Main Test Suite', () => {

  test('TC_NS_01_Non_Streaming_17_Character_VIN_Validation', async ({ page, isMobile }) => {
    test.skip(({ isMobile }) => !isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming 17-Character VIN Decode Task ---');
    const home = new HomePage(page);
    await home.navigate();
    
    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page);
    console.log(`Successfully decoded 17-character VIN in non-streaming flow (${durationSeconds}s): ${vin}`);
  });

  test('TC_NS_02_Non_Streaming_Classic_VIN_Validation', async ({ page, isMobile }) => {
    test.skip(({ isMobile }) => !isMobile, 'Mobile test case; skipping on Desktop Chrome.');
    console.log('--- Executing Non-Streaming Classic VIN Decode Task ---');
    const home = new HomePage(page);
    await home.navigate();

    const { vin, durationSeconds } = await CalculateVinDecodeTimeTask.execute(page, { isClassic: true });
    
    await expect(page).toHaveURL(/.*(preview|report).*/i);
    console.log(`Successfully decoded Classic VIN in non-streaming flow (${durationSeconds}s) and verified preview page: ${vin}`);
  });

  test('TC_NS_03_Non_Streaming_EU_VIN_Confirmation_Validation', async ({ page, isMobile }) => {
    test.skip(({ isMobile }) => !isMobile, 'Mobile test case; skipping on Desktop Chrome.');
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
    test.skip(({ isMobile }) => !isMobile, 'Mobile test case; skipping on Desktop Chrome.');
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
    test.skip(({ isMobile }) => !isMobile, 'Mobile test case; skipping on Desktop Chrome.');
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
    test.skip(({ isMobile }) => isMobile, 'Exit intent pop-up test is desktop mouse-leave only; skipping on mobile devices.');
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
    test.skip(({ isMobile }) => !isMobile, 'Mobile test case; skipping on Desktop Chrome.');
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
});
