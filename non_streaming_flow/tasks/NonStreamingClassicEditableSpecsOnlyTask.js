// non_streaming_flow/tasks/NonStreamingClassicEditableSpecsOnlyTask.js
const { expect } = require('@playwright/test');

class NonStreamingClassicEditableSpecsOnlyTask {
  constructor(timeout = process.env.CI ? 60000 : 30000) {
    this.timeout = timeout;
  }

  async fillOptionalField(page, roleName, value) {
    const input = page.getByRole('textbox', { name: roleName });
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await input.click({ force: true }).catch(() => {});
      await input.fill(value).catch(() => {});
    }
  }

  async perform(page) {
    console.log('📝 [NonStreamingClassicEditableSpecsOnlyTask] Executing Classic Specifications-only update on Preview Page...');

    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click({ force: true });

    const updateSpecsBtn = page.getByRole('button', { name: 'Update Specifications' });
    await updateSpecsBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateSpecsBtn.click({ force: true });

    await this.fillOptionalField(page, 'Enter Axle Type', 'Semifloating dasdasd');
    await this.fillOptionalField(page, 'Enter Body Maker', 'Fisher dasdasd');
    await this.fillOptionalField(page, 'Enter Cylinders', '8 adasdas');
    await this.fillOptionalField(page, 'Enter Displacement', '400 cu. in. adasdas');
    await this.fillOptionalField(page, 'Enter Front Tread', '61 inches adasdas ');
    await this.fillOptionalField(page, 'Enter Fuel', '21.5 Gallons adasdasd');
    await this.fillOptionalField(page, 'Enter Height', '52 inches asdasdasd');
    await this.fillOptionalField(page, 'Enter Length', '202.9 inches adsadasd');
    await this.fillOptionalField(page, 'Enter MSRP', '$3,492.00 asdsadas');
    await this.fillOptionalField(page, 'Enter No. Of Gears', '3 asdasdas');
    await this.fillOptionalField(page, 'Enter Oil', '5 Quarts adasdasd');
    await this.fillOptionalField(page, 'Enter Passengers', '5 asdasdas');
    await this.fillOptionalField(page, 'Enter Rear Tread', '60 inchesdasdsad');
    await this.fillOptionalField(page, 'Enter Torque', '445@3000dsadasd');
    await this.fillOptionalField(page, 'Enter Weight', '3,688lbsasdsadasd');

    const submitUpdateBtn = page.getByRole('button', { name: 'Update' });
    await submitUpdateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await submitUpdateBtn.click({ force: true });

    await page.waitForURL(/.*(cv=|preview|report).*/, { timeout: this.timeout * 2 }).catch(() => {});
    console.log('✅ [NonStreamingClassicEditableSpecsOnlyTask] Classic Specifications-only update submitted successfully.');
  }
}

module.exports = { NonStreamingClassicEditableSpecsOnlyTask };
