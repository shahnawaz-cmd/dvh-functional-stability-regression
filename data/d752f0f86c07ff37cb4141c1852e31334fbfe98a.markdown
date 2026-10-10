# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/streaming2-e2e.spec.js >> TC_23_Sticker_Upsell_Text_Validation
- Location: tests/streaming2-e2e.spec.js:452:1

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1  | // tests/pages/HomePage.js
  2  | const TIMEOUT = process.env.CI ? 60000 : 30000;
  3  | 
  4  | class HomePage {
  5  |   constructor(page) {
  6  |     this.page = page;
  7  |     this.vinInput = page.locator('input[name="vin"], input[placeholder*="VIN" i], input[aria-label*="VIN" i]').first();
  8  |     this.searchButton = page.getByRole('button', { name: /search vin|get window sticker|search window sticker|get sticker|search/i })
  9  |       .or(page.locator('button[type="submit"]'))
  10 |       .or(page.locator('button:has-text("Search VIN")'))
  11 |       .first();
  12 |   }
  13 | 
  14 |   randomizeVin(baseVin, numToReplace = 1) {
  15 |     const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace)).toString().padStart(numToReplace, '0');
  16 |     return baseVin.slice(0, -numToReplace) + randomDigits;
  17 |   }
  18 | 
  19 |   async navigate() {
  20 |     await this.page.goto('/');
  21 |     await this.page.waitForLoadState('load');
  22 |     await this.page.waitForLoadState('networkidle').catch(() => {});
  23 |     await this.page.waitForTimeout(800);
  24 |   }
  25 | 
  26 |   async navigateWithOffer(offerCode) {
  27 |     await this.page.goto(`/?offer=${offerCode}`);
  28 |     await this.page.waitForLoadState('load');
  29 |     await this.page.waitForLoadState('networkidle').catch(() => {});
  30 |     await this.page.waitForTimeout(800);
  31 |   }
  32 | 
  33 |   async navigateWindowSticker() {
  34 |     await this.page.goto('/window-sticker');
  35 |     await this.page.waitForLoadState('load');
  36 |     await this.page.waitForLoadState('networkidle').catch(() => {});
> 37 |     await this.page.waitForTimeout(800);
     |                     ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  38 |   }
  39 | 
  40 |   async decodeVin(vin, numToReplace = 1) {
  41 |     await this.page.waitForLoadState('load');
  42 | 
  43 |     const isSafari = this.page.context().browser()?.browserType().name() === 'webkit';
  44 | 
  45 |     const vinInput = this.page.locator('input[name="vin"], input[placeholder*="VIN" i], input[aria-label*="VIN" i]').first();
  46 |     await vinInput.waitFor({ state: 'visible', timeout: TIMEOUT });
  47 | 
  48 |     const randomVin = this.randomizeVin(vin, numToReplace);
  49 |     await vinInput.focus();
  50 |     await vinInput.fill(randomVin);
  51 | 
  52 |     if (isSafari) {
  53 |       await this.page.evaluate(() => {
  54 |         const input = document.querySelector('input[name="vin"], input[placeholder*="VIN" i]');
  55 |         const form = input ? input.closest('form') : null;
  56 |         if (form) {
  57 |           form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  58 |         } else {
  59 |           const btn = document.querySelector('button[type="submit"]') || document.querySelector('button');
  60 |           if (btn) btn.click();
  61 |         }
  62 |       });
  63 |       await this.page.waitForURL(/.*\/vin-check\/(preview|checkout).*/, { timeout: TIMEOUT }).catch(() => {});
  64 |     } else {
  65 |       const btn = this.page.locator('button[type="submit"], button:has-text("Search VIN"), button:has-text("Search Window Sticker"), button:has-text("Get Window Sticker")').first();
  66 |       await btn.waitFor({ state: 'visible', timeout: TIMEOUT }).catch(() => {});
  67 |       await btn.click().catch(async () => {
  68 |         await vinInput.press('Enter');
  69 |       });
  70 |     }
  71 | 
  72 |     return randomVin;
  73 |   }
  74 | 
  75 |   }
  76 | class EUVinDecoder {
  77 |   constructor() {
  78 |     this.baseVins = [
  79 |       'VF3YC2MFB12G20874',
  80 |       'WBY1Z62030V719559',
  81 |       'WV1ZZZSYZL9025249',
  82 |       'SHHEU88701U002012',
  83 |       'WAUZZZ8V5DA002440'
  84 |     ];
  85 |   }
  86 | 
  87 |   generateEUVin() {
  88 |     const baseVin = this.baseVins[Math.floor(Math.random() * this.baseVins.length)];
  89 |     const randomDigit = Math.floor(Math.random() * 10).toString();
  90 |     return baseVin.slice(0, -1) + randomDigit;
  91 |   }
  92 | }
  93 | 
  94 | module.exports = { HomePage, EUVinDecoder };
  95 | 
```