# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_05_Window_Sticker_Revisit_Banner_Validation
- Location: tests/streaming2-e2e.spec.js:81:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('text=Your window sticker for') to be visible

```

# Test source

```ts
  1  | // tests/pages/HomePage.js
  2  | const TIMEOUT = process.env.CI ? 60000 : 30000;
  3  | 
  4  | class HomePage {
  5  |   constructor(page) {
  6  |     this.page = page;
  7  |     this.vinInput = page.locator('input[placeholder*="VIN"]');
  8  |     this.searchButton = page.locator('button:has-text("Search VIN")');
  9  |   }
  10 | 
  11 |   randomizeVin(baseVin, numToReplace = 1) {
  12 |     const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace)).toString().padStart(numToReplace, '0');
  13 |     return baseVin.slice(0, -numToReplace) + randomDigits;
  14 |   }
  15 | 
  16 |   async navigate() {
  17 |     await this.page.goto('/');
  18 |   }
  19 | 
  20 |   async navigateWithOffer(offerCode) {
  21 |     await this.page.goto(`/?offer=${offerCode}`);
  22 |   }
  23 | 
  24 |   async decodeVin(vin, numToReplace = 1) {
  25 |     // Wait for the page to be fully loaded
  26 |     await this.page.waitForLoadState('load');
  27 |     
  28 |     // Explicitly wait 1 second for base URL stability
  29 |     await this.page.waitForTimeout(1000);
  30 |     
  31 |     // Condition-based wait for the input to be visible and ready
  32 |     await this.vinInput.waitFor({ state: 'visible', timeout: TIMEOUT });
  33 |     
  34 |     const randomVin = this.randomizeVin(vin, numToReplace);
  35 |     await this.vinInput.fill(randomVin);
  36 |     await this.searchButton.click();
  37 |     return randomVin;
  38 |   }
  39 | 
  40 |   async verifyRevisitBannerVisible(bannerText = 'Your report for') {
  41 |     await this.page.waitForLoadState('load');
  42 |     const banner = this.page.locator(`text=${bannerText}`);
> 43 |     await banner.waitFor({ state: 'visible', timeout: TIMEOUT });
     |                  ^ TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
  44 |     return banner;
  45 |   }
  46 | 
  47 |   async clickGrabItNow(banner) {
  48 |     const grabItNowButton = this.page.locator('button:has-text("Grab it now")').first();
  49 |     await grabItNowButton.waitFor({ state: 'visible', timeout: TIMEOUT });
  50 |     await grabItNowButton.waitFor({ state: 'attached', timeout: TIMEOUT });
  51 |     await grabItNowButton.click();
  52 |   }
  53 | }
  54 | class EUVinDecoder {
  55 |   constructor() {
  56 |     this.baseVins = [
  57 |       'VF3YC2MFB12G20874',
  58 |       'WBY1Z62030V719559',
  59 |       'WV1ZZZSYZL9025249',
  60 |       'SHHEU88701U002012',
  61 |       'WAUZZZ8V5DA002440'
  62 |     ];
  63 |   }
  64 | 
  65 |   generateEUVin() {
  66 |     const baseVin = this.baseVins[Math.floor(Math.random() * this.baseVins.length)];
  67 |     const randomDigit = Math.floor(Math.random() * 10).toString();
  68 |     return baseVin.slice(0, -1) + randomDigit;
  69 |   }
  70 | }
  71 | 
  72 | module.exports = { HomePage, EUVinDecoder };
  73 | 
```