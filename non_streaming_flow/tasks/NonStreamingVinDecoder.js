// non_streaming_flow/tasks/NonStreamingVinDecoder.js
const { expect } = require('@playwright/test');

class NonStreamingVinDecoder {
  constructor({
    shouldClose = true,
    skipSuccessClick = false,
    timeout = 60000,
    selectors = {}
  } = {}) {
    this.shouldClose = shouldClose;
    this.skipSuccessClick = skipSuccessClick;
    this.timeout = timeout;
    this.selectors = {
      vinField1: 'Vehicle Identification Number',
      vinField2: 'Enter VIN Number',
      vinField3: 'Enter Your VIN',
      searchButton: 'Search VIN',
      accessButton: 'Access Records',
      successText: 'Records found for',
      successText2: 'We found historical records for the',
      successText3: 'Window sticker found for',
      successText4: 'Searching records for',
      successHeading: 'Success! We found detailed',
      successHeading2: 'We found detailed information for the',
      ...selectors
    };
  }

  generateRandomVin(baseVin, numToReplace = 1) {
    const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace))
      .toString()
      .padStart(numToReplace, '0');
    return baseVin.slice(0, -numToReplace) + randomDigits;
  }

  generateUSVin(isMVL = false) {
    const baseVins = [
      '2C4RC1BG3SR518739',
      'WA1BNAFY8J2112512',
      '1C4RJFBG7KC671605',
      'JM3KFBBL3R0438560',
      '1FMCU9GD3JUC83708'
    ];
    const baseVin = baseVins[Math.floor(Math.random() * baseVins.length)];
    // Randomize last 2 to 3 characters on every run
    const numToReplace = Math.floor(Math.random() * 2) + 2; // 2 or 3 digits
    return this.generateRandomVin(baseVin, numToReplace);
  }

  generateEuVin() {
    const baseVins = [
      'VF3YC2MFB12G20874',
      'SHHEU88701U002012'
    ];
    const baseVin = baseVins[Math.floor(Math.random() * baseVins.length)];
    return this.generateRandomVin(baseVin, 1);
  }

  generateClassicVin() {
    const classicVins = [
      'XP29G72104639',
      'M176103674',
      '3N67K5M340214',
      '1H57H5Z447879',
      '242378Z126752',
      'PH27G62105038',
      'CL41M3C146664'
    ];
    const baseVin = classicVins[Math.floor(Math.random() * classicVins.length)];
    const chars = baseVin.split('');
    const digits = '0123456789';
    for (let i = chars.length - 4; i < chars.length; i++) {
      chars[i] = digits[Math.floor(Math.random() * digits.length)];
    }
    return chars.join('');
  }

  async perform(page, { isClassic = false, isEU = false } = {}) {
    const isMVL = page.url().includes('motorcyclevinlookup.com');
    const isTC14 = this.skipSuccessClick;
    let vin;
    if (isClassic) {
      vin = this.generateClassicVin();
    } else if (isEU || isTC14) {
      vin = this.generateEuVin();
    } else {
      vin = this.generateUSVin(isMVL);
    }
    console.log(`[NonStreamingVinDecoder] Generated VIN (${isClassic ? 'Classic' : (isEU || isTC14) ? 'EU' : 'US'}): ${vin}`);

    const vinField1 = page.getByRole('textbox', { name: this.selectors.vinField1 });
    const vinField2 = page.getByRole('textbox', { name: this.selectors.vinField2 });
    const vinField3 = this.selectors.vinField3 ? page.getByRole('textbox', { name: this.selectors.vinField3 }) : null;

    await page.waitForSelector('input[name="vin"], input[placeholder*="VIN" i], input[aria-label*="VIN" i]', { state: 'attached', timeout: this.timeout }).catch(() => {});

    let vinInput = null;
    if (await vinField1.isVisible()) {
      vinInput = vinField1;
    } else if (await vinField2.isVisible()) {
      vinInput = vinField2;
    } else if (vinField3 && await vinField3.isVisible()) {
      vinInput = vinField3;
    }

    if (!vinInput) {
      vinInput = page.locator('input[name="vin"], input[placeholder*="VIN" i], input[aria-label*="VIN" i]').first();
    }

    await vinInput.waitFor({ state: 'visible', timeout: this.timeout });

    // Check if running on Safari / WebKit engine
    const isSafari = page.context().browser()?.browserType().name() === 'webkit';
    if (isSafari) {
      console.log('[NonStreamingVinDecoder] Safari browser detected - applying 1s delay after base URL load before putting VIN');
      await page.waitForTimeout(1000);
    }

    await vinInput.fill(vin);

    const searchBtn = page.getByRole('button', { name: this.selectors.searchButton }).first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await vinInput.locator('xpath=../..').getByRole('button').first().click();
    }
    
    await page.waitForTimeout(1000);

    const successLocator = page.getByText('Records found for', { exact: false })
      .or(page.locator('h1:has-text("Records found for")'))
      .or(page.locator('text=We found detailed information for the'))
      .or(page.locator('h2:has-text("We found")'))
      .or(page.getByRole('heading', { name: 'Success' }))
      .or(page.getByRole('heading', { name: 'Success! We found detailed' }))
      .or(page.locator('h4:has-text("Success!")'))
      .or(page.getByText('Success! We found detailed', { exact: false }))
      .or(page.locator('text=Window sticker found for'))
      .or(page.locator('text=We found historical records for the'))
      .or(page.locator('text=Success!'));

    await successLocator.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {
      console.log('[DecodeVinTask] Timeout waiting for success locator visibility');
    });

    const successLocators = [
      page.getByText('Records found for', { exact: false }),
      page.locator('h1:has-text("Records found for")'),
      page.locator('text=We found detailed information for the'),
      page.locator('h2:has-text("We found")'),
      page.getByRole('heading', { name: 'Success' }),
      page.getByRole('heading', { name: 'Success! We found detailed' }),
      page.locator('h4:has-text("Success!")'),
      page.getByText('Success! We found detailed', { exact: false }),
      page.locator('text=Window sticker found for'),
      page.locator('text=We found historical records for the'),
      page.locator('text=Success!')
    ];

    let successClicked = false;

    if (this.skipSuccessClick) {
      console.log('[DecodeVinTask] Bypassing success banner click as requested.');
      successClicked = true;
    } else {
      for (const locator of successLocators) {
        if (await locator.isVisible()) {
          console.log('[DecodeVinTask] Clicking success element...');
          await locator.click().catch(() => {});
          successClicked = true;
          break;
        }
      }
    }

    if (!successClicked) {
      if (page.url().includes('/preview') || page.url().includes('vin-check/preview') || page.url().includes('/report/')) {
        console.log('[NonStreamingVinDecoder] Preview page URL verified:', page.url());
        successClicked = true;
      }
    }

    if (!successClicked) {
      console.log('[DecodeVinTask] Failed to click success condition. Current URL:', page.url());
      throw new Error('Success condition not found');
    }

    console.log('[NonStreamingVinDecoder] Success condition met.');
    return vin;
  }
}

module.exports = { NonStreamingVinDecoder };
