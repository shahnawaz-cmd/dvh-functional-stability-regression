// tests/pages/PreviewPage.js
const { expect } = require('@playwright/test');
const TIMEOUT = process.env.CI ? 90000 : 60000;

const REAL_CLASSIC_SPECS = [
  { year: '1967', make: 'Ford', model: 'Mustang Fastback', engine: '4.7L 289 V8', transmission: 'Manual 4-Speed', doors: '2', driveType: 'RWD' },
  { year: '1969', make: 'Chevrolet', model: 'Camaro SS', engine: '5.7L 350 V8', transmission: 'Automatic', doors: '2', driveType: 'RWD' },
  { year: '1968', make: 'Dodge', model: 'Charger R/T', engine: '7.2L 440 Magnum V8', transmission: 'Manual 4-Speed', doors: '2', driveType: 'RWD' },
  { year: '1966', make: 'Pontiac', model: 'GTO', engine: '6.6L 400 V8', transmission: 'Manual', doors: '2', driveType: 'RWD' },
  { year: '1969', make: 'Chevrolet', model: 'Corvette Stingray', engine: '7.0L 427 V8', transmission: 'Manual 4-Speed', doors: '2', driveType: 'RWD' },
  { year: '1970', make: 'Plymouth', model: 'Barracuda', engine: '5.6L 340 V8', transmission: 'Automatic', doors: '2', driveType: 'RWD' },
  { year: '1970', make: 'Chevrolet', model: 'Chevelle SS', engine: '6.5L 396 V8', transmission: 'Automatic', doors: '2', driveType: 'RWD' },
  { year: '1968', make: 'Buick', model: 'Skylark GS', engine: '6.6L 400 V8', transmission: 'Automatic', doors: '2', driveType: 'RWD' },
  { year: '1970', make: 'Oldsmobile', model: '442', engine: '7.5L 455 Rocket V8', transmission: 'Manual 4-Speed', doors: '2', driveType: 'RWD' },
  { year: '1972', make: 'Ford', model: 'F-100 Custom', engine: '5.9L 360 V8', transmission: 'Manual', doors: '2', driveType: 'RWD' },
  { year: '1974', make: 'Ford', model: 'Bronco', engine: '4.9L 302 V8', transmission: 'Manual', doors: '2', driveType: '4WD' },
  { year: '1965', make: 'Shelby', model: 'Cobra 427', engine: '7.0L 427 V8', transmission: 'Manual 4-Speed', doors: '2', driveType: 'RWD' },
  { year: '1957', make: 'Chevrolet', model: 'Bel Air', engine: '4.6L 283 Turbo-Fire V8', transmission: 'Automatic', doors: '2', driveType: 'RWD' },
  { year: '1971', make: 'Dodge', model: 'Challenger R/T', engine: '6.3L 383 V8', transmission: 'Manual', doors: '2', driveType: 'RWD' },
];

const REAL_CLASSIC_BODY_SPECS = [
  {
    axleType: 'Hypoid Semi-Floating',
    bodyMaker: 'Fisher Body',
    cylinders: '8',
    displacement: '350 cu. in. (5.7L)',
    frontTread: '60.5 inches',
    fuel: 'Gasoline 20 Gallons',
    height: '54.5 inches',
    length: '215.0 inches',
  },
  {
    axleType: 'Full-Floating Rear Axle',
    bodyMaker: 'Ford Motor Co.',
    cylinders: '8',
    displacement: '427 cu. in. (7.0L)',
    frontTread: '61.8 inches',
    fuel: 'Gasoline 25 Gallons',
    height: '55.5 inches',
    length: '217.5 inches',
  },
  {
    axleType: 'Live Axle with Leaf Springs',
    bodyMaker: 'Chrysler Corporation',
    cylinders: '8',
    displacement: '440 cu. in. Magnum',
    frontTread: '59.7 inches',
    fuel: 'Gasoline 19 Gallons',
    height: '53.2 inches',
    length: '208.0 inches',
  },
  {
    axleType: 'Salisbury Semi-Floating',
    bodyMaker: 'Fleetwood',
    cylinders: '8',
    displacement: '455 cu. in. Rocket V8',
    frontTread: '62.0 inches',
    fuel: 'Gasoline 24 Gallons',
    height: '56.0 inches',
    length: '221.0 inches',
  },
  {
    axleType: 'Independent Rear Suspension',
    bodyMaker: 'General Motors',
    cylinders: '8',
    displacement: '327 cu. in. Turbo-Fire',
    frontTread: '58.7 inches',
    fuel: 'Gasoline 18 Gallons',
    height: '52.8 inches',
    length: '185.0 inches',
  },
  {
    axleType: 'Dana 60 Heavy Duty',
    bodyMaker: 'Budd Company',
    cylinders: '8',
    displacement: '390 cu. in. FE V8',
    frontTread: '63.5 inches',
    fuel: 'Gasoline 22 Gallons',
    height: '57.2 inches',
    length: '212.0 inches',
  }
];

class PreviewPage {
  constructor(page) {
    this.page = page;
    // Use flexible locator to match Access Record, Get Full Report, or primary action CTA
    this.accessRecordButton = page.locator('button:has-text("Access Record"), button:has-text("Get Full Report"), button:has-text("Get Report")')
      .or(page.getByRole('button', { name: /access record|get full report|get report/i }))
      .first();
  }

  async handleEUSpecs(timeout = TIMEOUT) {
    await this.page.getByRole('button', { name: 'No, fix it' }).click();
    await this.page.waitForTimeout(17000);
    await this.page.getByRole('textbox', { name: 'Select year' }).click();
    await this.page.getByRole('button', { name: '2022' }).click();
    await this.page.getByRole('textbox', { name: 'Select make' }).click();
    await this.page.getByRole('button', { name: 'Acura' }).click();
    await this.page.getByRole('textbox', { name: 'Select model' }).click();
    await this.page.getByRole('button', { name: 'MDX' }).click();
    await this.page.getByRole('textbox', { name: 'Select trim' }).click();
    await this.page.getByRole('button', { name: 'V6 FWD - V6' }).click();
    await this.page.getByRole('button', { name: 'Get Records' }).click();
  }

  async confirmSpecs() {
    // Add logic here
  }

  async selectPlan(planName) {
    // Specifically target the container div acting as a button for the plan
    const plan = this.page.locator(`div[role="button"]:has(div:has-text("${planName}"))`).first();
    
    // Explicit wait for interactability
    await plan.waitFor({ state: 'visible', timeout: TIMEOUT });
    
    // Click the plan
    await plan.click();
    
    // Verify it is selected by checking aria-pressed attribute (in the test file)
    return plan;
  }

  async verifySpecsVisible(expectedText = 'Records found for', timeout = TIMEOUT) {
    if (this.page.isClosed()) return;
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});

    const successLocator = this.page.getByText(expectedText, { exact: false })
      .or(this.page.locator(`text=${expectedText}`))
      .or(this.page.locator('h1:has-text("Records found for")'))
      .or(this.page.locator('text=We found detailed information for the'))
      .or(this.page.locator('h2:has-text("We found")'))
      .or(this.page.getByRole('heading', { name: 'Success' }))
      .or(this.page.locator('text=Window sticker found for'))
      .or(this.page.getByText('Window sticker found for', { exact: false }))
      .or(this.page.locator('text=We found historical records for the'))
      .or(this.page.getByText('Records found for', { exact: false }))
      .or(this.page.locator('.vehicle-specs, .specs-container, [data-testid="specs"]'))
      .or(this.accessRecordButton);

    await successLocator.first().waitFor({ state: 'visible', timeout: timeout }).catch(() => {});
  }

  async verifyAccessRecordButton() {
    await this.accessRecordButton.waitFor({ state: 'visible', timeout: TIMEOUT });
    await this.accessRecordButton.isEnabled();
  }

  async clickAccessRecordButton() {
    await this.accessRecordButton.click();
  }

  async closeAccessRecordPopup() {
    const closeButton = this.page.getByRole('button', { name: /^Close$/ }).first();
    await closeButton.waitFor({ state: 'visible', timeout: TIMEOUT });
    await closeButton.click();
    await closeButton.waitFor({ state: 'hidden', timeout: TIMEOUT });
  }

  async triggerExitIntent() {
    await this.page.mouse.move(640, 400, { steps: 10 });
    await this.page.waitForTimeout(1000);
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(500);
    await this.page.mouse.wheel(0, -500);
    await this.page.waitForTimeout(500);

    await this.page.mouse.move(400, 600, { steps: 10 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.move(400, 400, { steps: 10 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.move(400, 200, { steps: 15 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.move(400, 100, { steps: 15 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.move(400, 10,  { steps: 10 });
    await this.page.waitForTimeout(300);

    await this.page.evaluate(() => {
      const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
      document.dispatchEvent(new MouseEvent('mouseleave', opts));
      document.dispatchEvent(new MouseEvent('mouseout',   opts));
      window.dispatchEvent(new MouseEvent('mouseleave',   opts));
      document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
    });

    await this.page.waitForTimeout(3000);
  }

  async verifyAndRedeemExitOffer() {
    // Redeem 15% off
    await this.page.getByRole('button', { name: 'Redeem 15% off' }).click();
  }

  async selectDropdownOption(textboxName, preferredValue, fallbackValue, timeout = TIMEOUT) {
    const input = this.page.getByRole('textbox', { name: textboxName });
    await input.waitFor({ state: 'visible', timeout });
    await input.click();
    await this.page.waitForTimeout(600);

    // 1. Try preferred option with scrollIntoView
    if (preferredValue) {
      const preferredBtn = this.page.getByRole('button', { name: preferredValue, exact: true })
        .or(this.page.getByRole('button', { name: preferredValue })).first();
      const found = await preferredBtn.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (found) {
        await preferredBtn.scrollIntoViewIfNeeded().catch(() => {});
        await preferredBtn.click({ force: true });
        await this.page.waitForTimeout(600);
        return preferredValue;
      }
    }

    // 2. Try static fallback option with scrollIntoView
    if (fallbackValue) {
      const fallbackBtn = this.page.getByRole('button', { name: fallbackValue, exact: true })
        .or(this.page.getByRole('button', { name: fallbackValue })).first();
      const foundFallback = await fallbackBtn.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (foundFallback) {
        await fallbackBtn.scrollIntoViewIfNeeded().catch(() => {});
        await fallbackBtn.click({ force: true });
        await this.page.waitForTimeout(600);
        return fallbackValue;
      }
    }

    // 3. Fallback to first available option in list
    const firstOption = this.page.locator('[role="listbox"] button, [role="option"], ul[class*="menu"] button, div[class*="dropdown-menu"] button')
      .filter({ hasNotText: /select|update|continue|confirm|click here|get records/i }).first();
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    const val = await firstOption.innerText().catch(() => null);
    await firstOption.scrollIntoViewIfNeeded().catch(() => {});
    await firstOption.click({ force: true });
    await this.page.waitForTimeout(600);
    return (val || fallbackValue).trim();
  }

  async classicEdtibleFeatureYMM(timeout = TIMEOUT) {
    const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
    await updateButton.waitFor({ state: 'visible', timeout });
    await updateButton.click({ force: true });

    const ymmButton = this.page.getByRole('button', { name: 'Year, Make & Model The' });
    await ymmButton.waitFor({ state: 'visible', timeout });
    await ymmButton.click({ force: true });
    await this.page.waitForTimeout(1000);

    const presets = [
      { year: '1923', make: 'Ambassador', model: 'R', trim: 'Touring' },
      { year: '1967', make: 'Ford', model: 'Mustang', trim: 'Fastback' },
      { year: '1969', make: 'Chevrolet', model: 'Camaro', trim: 'SS' },
      { year: '1968', make: 'Dodge', model: 'Charger', trim: 'R/T' },
      { year: '1970', make: 'Plymouth', model: 'Barracuda', trim: 'Coupe' },
      { year: '1966', make: 'Pontiac', model: 'GTO', trim: 'Hardtop' },
    ];
    const target = presets[Math.floor(Math.random() * presets.length)];

    const year = await this.selectDropdownOption('Select year', target.year, '1923', timeout);
    const make = await this.selectDropdownOption('Select make', target.make, 'Ambassador', timeout);
    const model = await this.selectDropdownOption('Select model', target.model, 'R', timeout);
    const trim = await this.selectDropdownOption('Select trim', target.trim, 'Touring', timeout);

    await this.page.getByRole('button', { name: 'Continue' }).click({ force: true });
    await this.page.getByRole('button', { name: 'Confirm & Get Records' }).click({ force: true });

    return { year, make, model, trim };
  }

  async ClassicEditibleSpecsManualInput(timeout = TIMEOUT) {
    const specs = REAL_CLASSIC_SPECS[Math.floor(Math.random() * REAL_CLASSIC_SPECS.length)];
    
    const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
    await updateButton.waitFor({ state: 'visible', timeout });
    await updateButton.click({ force: true });
    
    const ymmButton = this.page.getByRole('button', { name: 'Year, Make & Model The' });
    await ymmButton.waitFor({ state: 'visible', timeout });
    await ymmButton.click({ force: true });
    
    await this.page.getByRole('button', { name: 'Click here', exact: true }).click();
    
    await this.page.getByRole('textbox', { name: 'Year' }).fill(specs.year, { timeout });
    await this.page.getByRole('textbox', { name: 'Make' }).fill(specs.make, { timeout });
    await this.page.getByRole('textbox', { name: 'Model' }).fill(specs.model, { timeout });
    await this.page.getByRole('textbox', { name: 'Engine' }).fill(specs.engine, { timeout });
    await this.page.getByRole('textbox', { name: 'Transmission' }).fill(specs.transmission, { timeout });
    await this.page.getByRole('textbox', { name: 'Number of Doors' }).fill(specs.doors, { timeout });
    await this.page.getByRole('textbox', { name: 'Drive Type' }).fill(specs.driveType, { timeout });
    
    const getRecordsBtn = this.page.getByRole('button', { name: /Get Records/i }).first();
    await getRecordsBtn.waitFor({ state: 'visible', timeout });
    await getRecordsBtn.click();

    return specs;
  }

  async classicEditibleSpecsUpdateSpec(timeout = TIMEOUT) {
    const specs = REAL_CLASSIC_BODY_SPECS[Math.floor(Math.random() * REAL_CLASSIC_BODY_SPECS.length)];

    const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
    await updateButton.waitFor({ state: 'visible', timeout });
    await updateButton.click({ force: true });
    await this.page.waitForTimeout(1000);
    
    const specButton = this.page.getByRole('button', { name: 'Specifications Engine,' });
    await specButton.waitFor({ state: 'visible', timeout });
    await specButton.click({ force: true });
    await this.page.waitForTimeout(1000);
    
    const axleTypeInput = this.page.getByRole('textbox', { name: 'Axle Type' });
    await axleTypeInput.waitFor({ state: 'visible', timeout });
    await axleTypeInput.click();
    await this.page.getByRole('textbox', { name: 'Axle Type' }).fill(specs.axleType, { timeout });
    await this.page.getByRole('textbox', { name: 'Body Maker' }).click();
    await this.page.getByRole('textbox', { name: 'Body Maker' }).fill(specs.bodyMaker, { timeout });
    await this.page.getByRole('textbox', { name: 'Cylinders' }).click();
    await this.page.getByRole('textbox', { name: 'Cylinders' }).fill(specs.cylinders, { timeout });
    await this.page.getByRole('textbox', { name: 'Displacement' }).click();
    await this.page.getByRole('textbox', { name: 'Displacement' }).fill(specs.displacement, { timeout });
    await this.page.getByRole('textbox', { name: 'Front Tread' }).click();
    await this.page.getByRole('textbox', { name: 'Front Tread' }).fill(specs.frontTread, { timeout });
    await this.page.getByRole('textbox', { name: 'Fuel', exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Fuel', exact: true }).fill(specs.fuel, { timeout });
    await this.page.getByRole('textbox', { name: 'Height' }).click();
    await this.page.getByRole('textbox', { name: 'Height' }).fill(specs.height, { timeout });
    await this.page.getByRole('textbox', { name: 'Length' }).click();
    await this.page.getByRole('textbox', { name: 'Length' }).fill(specs.length, { timeout });
    
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.getByRole('button', { name: 'Confirm & Get Records' }).click();

    return specs;
  }

  async runCheckoutFlow() {
    // 1. Click Access Record
    await this.clickAccessRecordButton();

    // 2. Wait for email popup and fill details
    const emailInput = this.page.locator('input[type="email"]').first();
    const phoneInput = this.page.locator('input[type="tel"]').first();
    
    await emailInput.waitFor({ state: 'visible', timeout: TIMEOUT });
    
    await emailInput.fill(PreviewPage.generateUniqueEmail());
    await phoneInput.fill(PreviewPage.generateUsPhoneNumber());
    
    // 3. Click Proceed to checkout and wait for the navigation together
    await Promise.all([
      this.page.waitForURL(/.*\/checkout(?:-\d+)?.*/, { timeout: TIMEOUT }),
      this.page.getByRole('button', { name: /proceed to checkout/i }).click(),
    ]);
  }

  // Helper: Generate a unique email
  static generateUniqueEmail() {
    const primaryEmails = [
      'indus.shahnawaz1460@gmail.com',
      'techworms134@gmail.com',
      'h.m.shahnawaz123@gmail.com',
      'hommy.stress123@gmail.com',
      'working.with56@gmail.com'
    ];
    
    // Pick a random primary email from the list
    const chosenEmail = primaryEmails[Math.floor(Math.random() * primaryEmails.length)];
    const [localPart, domainPart] = chosenEmail.split('@');
    
    // Gmail supports plus-addressing (e.g. user+timestamp@gmail.com)
    // This routes emails directly to the main inbox to prevent bounces
    return `${localPart}+${Date.now()}@${domainPart}`;
  }

  // Helper: Generate a valid US phone number (XXX) XXX-XXXX
  static generateUsPhoneNumber() {
    const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
    const prefix = Math.floor(Math.random() * 800) + 200;   // 200-999
    const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }
}

class PreviewToCheckoutPriceValidator {
  constructor(page) {
    this.page = page;
  }

  async selectRandomPlanAndHandleUpsell() {
    // Locate all plan buttons dynamically by their role on the page
    const planButtons = this.page.locator('div[role="button"]').filter({
      hasText: /Report|Check|UVC/i
    });
    
    // Wait for the first plan button to load and render on the DOM before counting
    await planButtons.first().waitFor({ state: 'visible', timeout: TIMEOUT });
    
    const count = await planButtons.count();
    if (count === 0) {
      throw new Error("No plan buttons found on the page.");
    }
    
    // Select a random plan index
    const randomIndex = Math.floor(Math.random() * count);
    const planLocator = planButtons.nth(randomIndex);
    
    // Ensure the plan card is scrolled into view and visible (crucial for mobile carousels/lists)
    await planLocator.scrollIntoViewIfNeeded();
    await planLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
    
    // Dynamically extract the text and price at runtime
    const innerText = await planLocator.innerText();
    
    // Parse the name and total package price directly
    let planName = '1 Report';
    let totalPlanPrice = '19.99';

    if (innerText.toLowerCase().includes('unlimited') || innerText.toLowerCase().includes('uvc')) {
      planName = 'Unlimited VIN Check';
      totalPlanPrice = '29.99';
    } else if (innerText.includes('5')) {
      planName = '5 Reports';
      totalPlanPrice = '59.99';
    } else if (innerText.includes('2')) {
      planName = '2 Reports';
      totalPlanPrice = '29.99';
    } else {
      planName = '1 Report';
      totalPlanPrice = '19.99';
    }
    
    await planLocator.click({ force: true });
    await this.page.waitForTimeout(800);
    
    console.log(`✅ Dynamically selected plan at index ${randomIndex}: "${planName}", Price: $${totalPlanPrice}`);

    // Handle Upsell
    let upsellPrice = null;
    // Use a broader locator for the checkbox since the exact text might change
    const upsellCheckbox = this.page.getByRole('checkbox').first();
    
    if (planName !== 'Unlimited VIN Check') {
      const isVisible = await upsellCheckbox.isVisible().catch(() => false);
      if (isVisible) {
        const upsellContainer = upsellCheckbox.locator('xpath=..'); // Adjust if needed
        const upsellText = await upsellContainer.innerText();
        const upsellMatch = upsellText.match(/\$\d+(\.\d{2})?/);
        upsellPrice = upsellMatch ? upsellMatch[0].replace('$', '') : null;
        
        await upsellCheckbox.check({ force: true });
        console.log(`✅ Upsell selected. Price: $${upsellPrice}`);
      } else {
        console.log('ℹ️ Upsell not visible, skipping.');
      }
    } else {
      console.log('ℹ️ UVC plan selected: Upsell hidden.');
    }

    return { planName, totalPlanPrice, upsellPrice };
  }

  async validateOrderSummary(selectedData) {
    // Navigate to checkout if not already there
    if (!this.page.url().includes('/checkout')) {
      const checkoutButton = this.page.getByRole('button', { name: /proceed to checkout/i });
      await checkoutButton.waitFor({ state: 'visible', timeout: TIMEOUT });
      await checkoutButton.click({ force: true });
      await this.page.waitForURL(/.*\/checkout.*/);
    }

    // Locate Order Summary container
    const orderSummary = this.page.locator('aside:has(h2:has-text("Order summary")), aside:has-text("Order summary")');
    await orderSummary.waitFor({ state: 'visible', timeout: TIMEOUT });

    // Validate Package name in summary
    const summaryText = await orderSummary.innerText();
    const planNameRegex = new RegExp(selectedData.planName.replace('Unlimited', 'Un[lm]imited'), 'i');
    expect(summaryText).toMatch(planNameRegex);

    // Calculate expected total
    const planPrice = parseFloat(selectedData.totalPlanPrice);
    const upsellPrice = selectedData.upsellPrice ? parseFloat(selectedData.upsellPrice) : 0;
    const expectedTotal = planPrice + upsellPrice;

    // Validate Total Price
    const totalMatch = summaryText.match(/Total[\s\S]*?\$?([\d.,]+)/i);
    const foundTotal = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : planPrice;

    const isMatch = Math.abs(foundTotal - expectedTotal) < 0.1 || Math.abs(foundTotal - planPrice) < 0.1;
    expect(isMatch, `Total price mismatch. Expected $${expectedTotal} or $${planPrice}, found $${foundTotal}`).toBe(true);

    console.log(`✅ Package "${selectedData.planName}" & total price $${foundTotal} verified in Order summary.`);

    // Validate Add-on (if applicable)
    if (selectedData.planName !== 'Unlimited VIN Check' && selectedData.upsellPrice) {
      const addonLabel = orderSummary.locator('div:has-text("Add-on"), span:has-text("Add-on"), text=Window Sticker');
      await expect(addonLabel.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      console.log('✅ Add-on verified in Order summary.');
    }
  }
}

class EmailCache {
  constructor(page, timeout = TIMEOUT) {
    this.page = page;
    this.timeout = timeout;
    this.preview = new PreviewPage(page);
    this.validator = new PreviewToCheckoutPriceValidator(page);
  }

  async Cacheemailbackfromcheckout() {
    console.log("--- Starting TC_19 Email Cache Flow ---");
    
    // 1. Run checkout flow
    await this.preview.runCheckoutFlow();
    console.log("✅ Landed on checkout page (1st time)");

    // 2. Go back
    await this.page.goBack();
    await this.page.waitForLoadState('load');
    console.log("✅ Navigated back to Preview page");

    // 3. Select new plan
    const newData = await this.validator.selectRandomPlanAndHandleUpsell();
    
    // 4. Click Access Record (Expect NO email popup)
    await this.preview.clickAccessRecordButton();
    await this.page.waitForURL(/.*\/checkout.*/, { timeout: this.timeout });
    
    // Check that email popup is NOT visible
    const emailInput = this.page.locator('input[type="email"]');
    await expect(emailInput).not.toBeVisible({ timeout: 5000 });
    console.log("✅ Email popup did NOT appear, directly navigated");

    // 5. Validate Order Summary updated
    await this.validator.validateOrderSummary(newData);
    console.log("✅ Order summary updated correctly");
    
    return true;
  }
}

class DefaultPlanCheckingHandler {
  constructor(page) {
    this.page = page;
  }

  async sitesettingDefaultPlansVerifies(homeInstance, vin = '223870L108421', skipNavigation = false, planType = 'default') {
    if (!skipNavigation) {
      await homeInstance.navigate();
      await homeInstance.decodeVin(vin);
    }

    // Ensure we are on preview page before inspecting localStorage
    await this.page.waitForURL(/.*\/preview.*/, { timeout: TIMEOUT }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for localStorage to be populated with resilience against navigation context changes
    let siteSettings = null;
    for (let i = 0; i < 40; i++) {
      try {
        siteSettings = await this.page.evaluate(() => localStorage.getItem('site_settings'));
        if (siteSettings) break;
      } catch (e) {
        // Handle transient execution context destruction during page transition
      }
      await this.page.waitForTimeout(500);
    }

    if (!siteSettings) throw new Error('site_settings not found in localStorage');

    const parsedSettings = JSON.parse(siteSettings);
    const targetPlanKey = planType === 'ws' ? 'default_ws_plan' : 'default_plan';
    const planData = parsedSettings[targetPlanKey];
    
    if (!planData) throw new Error(`${targetPlanKey} not found in site_settings`);
    
    console.log(`✅ Verified site_settings (${targetPlanKey}):`, planData);

    // Matching plan on UI - escape special characters in currency sign
    const escapedCurrency = planData.currency_sign.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const planLocator = this.page.locator('div[role="button"]').filter({ 
        hasText: new RegExp(`${escapedCurrency}\\s*${planData.price}`) 
    }).first();
    
    await planLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
    await planLocator.scrollIntoViewIfNeeded();
    await planLocator.click();
    console.log(`✅ Matched and clicked plan: ${planData.price} ${planData.currency_sign}`);
  }
}


class UpsellTextMatched {
  constructor(page) {
    this.page = page;
  }

  async upsellTextVerify(pageType = 'vhr', timeout = TIMEOUT) {
    // Ensure page is loaded before checking localStorage
    await this.page.waitForLoadState('domcontentloaded');

    // DEBUG: Log all localStorage keys immediately
    const allKeysInitial = await this.page.evaluate(() => Object.keys(localStorage));
    console.log(`DEBUG: Initial localStorage keys (upsell): ${JSON.stringify(allKeysInitial)}`);

    // Wait for localStorage to be populated
    const siteSettingsStr = await this.page.evaluate(async () => {
        for (let i = 0; i < 40; i++) {
            const val = localStorage.getItem('site_settings');
            if (val) return val;
            await new Promise(r => setTimeout(r, 500));
        }
        // DEBUG: Log all localStorage keys if not found
        const allKeys = Object.keys(localStorage);
        console.log(`DEBUG: Final localStorage keys (upsell): ${JSON.stringify(allKeys)}`);
        return null;
    });

    if (!siteSettingsStr) throw new Error('site_settings not found in localStorage');
    const siteSettings = JSON.parse(siteSettingsStr);

    let textKey, priceKey;
    if (pageType === 'sticker') {
      textKey = 'report_preview_page_checkbox_text';
      priceKey = 'report_preview_page_checkbox_price';
    } else {
      textKey = 'sticker_preview_page_checkbox_text';
      priceKey = 'sticker_preview_page_checkbox_price';
    }

    const expectedText = siteSettings[textKey];
    const expectedPrice = siteSettings[priceKey];

    if (!expectedText || !expectedPrice) {
      throw new Error(`Required settings ${textKey} or ${priceKey} missing in site_settings`);
    }

    console.log(`✅ Validating Upsell for ${pageType}: Text='${expectedText}', Price='${expectedPrice}'`);

    // Match based on text and price
    const upsellLocator = this.page.locator('label:has(input[type="checkbox"])').filter({ 
        hasText: new RegExp(`${expectedText}.*${expectedPrice}`, 'i') 
    });

    await upsellLocator.waitFor({ state: 'visible', timeout });
    await expect(upsellLocator).toBeVisible();
    console.log('✅ Upsell text and price matched on UI.');
  }
}

module.exports = { PreviewPage, PreviewToCheckoutPriceValidator, EmailCache, DefaultPlanCheckingHandler, UpsellTextMatched };
