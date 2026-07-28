# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_15_Classic_Editible_Specs_Update
- Location: tests/streaming2-e2e.spec.js:258:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 90000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Axle Type' }) to be visible

```

# Test source

```ts
  68  |     await this.page.mouse.wheel(0, 500);
  69  |     await this.page.waitForTimeout(500);
  70  |     await this.page.mouse.wheel(0, -500);
  71  |     await this.page.waitForTimeout(500);
  72  | 
  73  |     await this.page.mouse.move(400, 600, { steps: 10 });
  74  |     await this.page.waitForTimeout(300);
  75  |     await this.page.mouse.move(400, 400, { steps: 10 });
  76  |     await this.page.waitForTimeout(300);
  77  |     await this.page.mouse.move(400, 200, { steps: 15 });
  78  |     await this.page.waitForTimeout(300);
  79  |     await this.page.mouse.move(400, 100, { steps: 15 });
  80  |     await this.page.waitForTimeout(300);
  81  |     await this.page.mouse.move(400, 10,  { steps: 10 });
  82  |     await this.page.waitForTimeout(300);
  83  | 
  84  |     await this.page.evaluate(() => {
  85  |       const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
  86  |       document.dispatchEvent(new MouseEvent('mouseleave', opts));
  87  |       document.dispatchEvent(new MouseEvent('mouseout',   opts));
  88  |       window.dispatchEvent(new MouseEvent('mouseleave',   opts));
  89  |       document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
  90  |     });
  91  | 
  92  |     await this.page.waitForTimeout(3000);
  93  |   }
  94  | 
  95  |   async verifyAndRedeemExitOffer() {
  96  |     // Redeem 15% off
  97  |     await this.page.getByRole('button', { name: 'Redeem 15% off' }).click();
  98  |   }
  99  | 
  100 |   async classicEdtibleFeatureYMM() {
  101 |     const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
  102 |     await updateButton.waitFor({ state: 'visible' });
  103 |     await updateButton.click({ force: true });
  104 | 
  105 |     const ymmButton = this.page.getByRole('button', { name: 'Year, Make & Model The' });
  106 |     await ymmButton.waitFor({ state: 'visible' });
  107 |     await ymmButton.click({ force: true });
  108 | 
  109 |     // Explicit 30s delay to allow popup stabilization as requested
  110 |     await this.page.waitForTimeout(30000);
  111 | 
  112 |     await this.page.getByRole('textbox', { name: 'Select year' }).click();
  113 |     await this.page.getByRole('button', { name: '1923' }).click();
  114 | 
  115 |     await this.page.getByRole('textbox', { name: 'Select make' }).click();
  116 |     await this.page.getByRole('button', { name: 'Ambassador' }).click();
  117 | 
  118 |     await this.page.getByRole('textbox', { name: 'Select model' }).click();
  119 |     await this.page.getByRole('button', { name: 'R', exact: true }).click();
  120 | 
  121 |     await this.page.getByRole('textbox', { name: 'Select trim' }).click();
  122 |     await this.page.getByRole('button', { name: 'Touring' }).click();
  123 | 
  124 |     await this.page.getByRole('button', { name: 'Continue' }).click();
  125 |     await this.page.getByRole('button', { name: 'Confirm & Get Records' }).click();
  126 |   }
  127 | 
  128 |   async ClassicEditibleSpecsManualInput(timeout = TIMEOUT) {
  129 |     const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
  130 |     await updateButton.waitFor({ state: 'visible', timeout });
  131 |     await updateButton.click({ force: true });
  132 |     
  133 |     const ymmButton = this.page.getByRole('button', { name: 'Year, Make & Model The' });
  134 |     await ymmButton.waitFor({ state: 'visible', timeout });
  135 |     await ymmButton.click({ force: true });
  136 |     
  137 |     await this.page.getByRole('button', { name: 'Click here', exact: true }).click();
  138 |     
  139 |     await this.page.getByRole('textbox', { name: 'Year' }).click();
  140 |     await this.page.getByRole('textbox', { name: 'Year' }).fill('1950', { timeout });
  141 |     await this.page.getByRole('textbox', { name: 'Make' }).click();
  142 |     await this.page.getByRole('textbox', { name: 'Make' }).fill('Ford', { timeout });
  143 |     await this.page.getByRole('textbox', { name: 'Model' }).click();
  144 |     await this.page.getByRole('textbox', { name: 'Model' }).fill('F-150', { timeout });
  145 |     await this.page.getByRole('textbox', { name: 'Engine' }).click();
  146 |     await this.page.getByRole('textbox', { name: 'Engine' }).fill('V9', { timeout });
  147 |     await this.page.getByRole('textbox', { name: 'Transmission' }).click();
  148 |     await this.page.getByRole('textbox', { name: 'Transmission' }).fill('Auto', { timeout });
  149 |     await this.page.getByRole('textbox', { name: 'Number of Doors' }).click();
  150 |     await this.page.getByRole('textbox', { name: 'Number of Doors' }).fill('4', { timeout });
  151 |     await this.page.getByRole('textbox', { name: 'Drive Type' }).click();
  152 |     await this.page.getByRole('textbox', { name: 'Drive Type' }).fill('AWD', { timeout });
  153 |     await this.page.getByRole('button', { name: 'Continue' }).click();
  154 |   }
  155 | 
  156 |   async classicEditibleSpecsUpdateSpec(timeout = TIMEOUT) {
  157 |     const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
  158 |     await updateButton.waitFor({ state: 'visible', timeout });
  159 |     await updateButton.click({ force: true });
  160 |     await this.page.waitForTimeout(1000);
  161 |     
  162 |     const specButton = this.page.getByRole('button', { name: 'Specifications Engine,' });
  163 |     await specButton.waitFor({ state: 'visible', timeout });
  164 |     await specButton.click({ force: true });
  165 |     await this.page.waitForTimeout(1000);
  166 |     
  167 |     const axleTypeInput = this.page.getByRole('textbox', { name: 'Axle Type' });
> 168 |     await axleTypeInput.waitFor({ state: 'visible', timeout });
      |                         ^ TimeoutError: locator.waitFor: Timeout 90000ms exceeded.
  169 |     await axleTypeInput.click();
  170 |     await this.page.getByRole('textbox', { name: 'Axle Type' }).fill('Semifloating asdfsss', { timeout });
  171 |     await this.page.getByRole('textbox', { name: 'Body Maker' }).click();
  172 |     await this.page.getByRole('textbox', { name: 'Body Maker' }).fill('Fisher asdsss', { timeout });
  173 |     await this.page.getByRole('textbox', { name: 'Cylinders' }).click();
  174 |     await this.page.getByRole('textbox', { name: 'Cylinders' }).fill('8 3333', { timeout });
  175 |     await this.page.getByRole('textbox', { name: 'Displacement' }).click();
  176 |     await this.page.getByRole('textbox', { name: 'Displacement' }).fill('330 cu. in. 22222', { timeout });
  177 |     await this.page.getByRole('textbox', { name: 'Front Tread' }).click();
  178 |     await this.page.getByRole('textbox', { name: 'Front Tread' }).fill('61.8 inches asdasd', { timeout });
  179 |     await this.page.getByRole('textbox', { name: 'Fuel' }).click();
  180 |     await this.page.getByRole('textbox', { name: 'Fuel' }).fill('25 Gallons sdadad', { timeout });
  181 |     await this.page.getByRole('textbox', { name: 'Height' }).click();
  182 |     await this.page.getByRole('textbox', { name: 'Height' }).fill('55.5 inches adasd', { timeout });
  183 |     await this.page.getByRole('textbox', { name: 'Length' }).click();
  184 |     await this.page.getByRole('textbox', { name: 'Length' }).fill('217 inches adasd', { timeout });
  185 |     
  186 |     await this.page.getByRole('button', { name: 'Continue' }).click();
  187 |     await this.page.getByRole('button', { name: 'Confirm & Get Records' }).click();
  188 |   }
  189 | 
  190 |   async runCheckoutFlow() {
  191 |     // 1. Click Access Record
  192 |     await this.clickAccessRecordButton();
  193 | 
  194 |     // 2. Wait for email popup and fill details
  195 |     const emailInput = this.page.locator('input[type="email"]').first();
  196 |     const phoneInput = this.page.locator('input[type="tel"]').first();
  197 |     
  198 |     await emailInput.waitFor({ state: 'visible', timeout: TIMEOUT });
  199 |     
  200 |     await emailInput.fill(PreviewPage.generateUniqueEmail());
  201 |     await phoneInput.fill(PreviewPage.generateUsPhoneNumber());
  202 |     
  203 |     // 3. Click Proceed to checkout and wait for the navigation together
  204 |     await Promise.all([
  205 |       this.page.waitForURL(/.*\/checkout(?:-\d+)?.*/, { timeout: TIMEOUT }),
  206 |       this.page.getByRole('button', { name: /proceed to checkout/i }).click(),
  207 |     ]);
  208 |   }
  209 | 
  210 |   // Helper: Generate a unique email
  211 |   static generateUniqueEmail() {
  212 |     return `test_${Date.now()}@example.com`;
  213 |   }
  214 | 
  215 |   // Helper: Generate a valid US phone number (XXX) XXX-XXXX
  216 |   static generateUsPhoneNumber() {
  217 |     const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
  218 |     const prefix = Math.floor(Math.random() * 800) + 200;   // 200-999
  219 |     const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  220 |     return `(${areaCode}) ${prefix}-${lineNumber}`;
  221 |   }
  222 | }
  223 | 
  224 | class PreviewToCheckoutPriceValidator {
  225 |   constructor(page) {
  226 |     this.page = page;
  227 |   }
  228 | 
  229 |   async selectRandomPlanAndHandleUpsell() {
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
```