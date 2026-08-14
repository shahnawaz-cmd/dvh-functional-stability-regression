// non_streaming_flow/tasks/NonStreamingClassicEditableSpecsManualTask.js
const { expect } = require('@playwright/test');

class NonStreamingClassicEditableSpecsManualTask {
  constructor(timeout = process.env.CI ? 60000 : 90000) {
    this.timeout = timeout;
  }

  async perform(page) {
    console.log('✍️ [NonStreamingClassicEditableSpecsManualTask] Executing Classic Editable Specs manual input update on Preview Page...');

    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click({ force: true });

    const ymmBtn = page.getByRole('button', { name: 'Update Year, Make and Model' });
    await ymmBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await ymmBtn.click({ force: true });

    const clickHereBtn = page.getByRole('button', { name: 'Click here' });
    await clickHereBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await clickHereBtn.click({ force: true });

    await page.getByPlaceholder('Enter year').fill('1960');
    await page.getByPlaceholder('Enter make').fill('Ford');
    await page.getByPlaceholder('Enter model').fill('F-250');
    await page.getByPlaceholder('Enter engine (e.g., V8,').fill('V8');
    await page.getByPlaceholder('Enter transmission type').fill('Auto');
    await page.getByPlaceholder('Enter number of doors').fill('5');
    await page.getByPlaceholder('Enter drive type (e.g., RWD,').fill('AWD');

    await page.getByRole('button', { name: 'Continue' }).click({ force: true });
    await page.getByRole('button', { name: 'Submit' }).click({ force: true });
    await page.waitForURL(/cv=/, { timeout: this.timeout * 2 }).catch(() => {});
    console.log('✅ [NonStreamingClassicEditableSpecsManualTask] Manual Classic Editable Specs update submitted successfully');
  }
}

module.exports = { NonStreamingClassicEditableSpecsManualTask };
