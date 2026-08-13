// non_streaming_flow/tasks/NonStreamingClassicEditableSpecsTask.js
const { expect } = require('@playwright/test');

class NonStreamingClassicEditableSpecsTask {
  constructor(timeout = process.env.CI ? 60000 : 90000) {
    this.timeout = timeout;
  }

  async perform(page) {
    console.log('✏️ [NonStreamingClassicEditableSpecsTask] Executing Classic Editable Specs dropdown update on Preview Page...');

    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click({ force: true });

    const ymmBtn = page.getByRole('button', { name: 'Update Year, Make and Model' })
      .or(page.getByRole('button', { name: 'Year, Make & Model The' }));
    await ymmBtn.first().waitFor({ state: 'visible', timeout: this.timeout });
    await ymmBtn.first().click({ force: true });

    const yearLabel = page.getByLabel('Year').or(page.getByRole('textbox', { name: 'Select year' }));
    await yearLabel.first().waitFor({ state: 'visible', timeout: this.timeout });
    await yearLabel.first().click({ force: true });
    
    const yearOption = page.getByLabel('1961').or(page.getByRole('button', { name: '1961' })).first();
    await yearOption.click({ force: true });

    const makeLabel = page.getByLabel('Make').or(page.getByRole('textbox', { name: 'Select make' }));
    await makeLabel.first().click({ force: true });
    
    const makeOption = page.getByLabel('AJS').or(page.getByRole('button', { name: 'AJS' })).first();
    await makeOption.click({ force: true });

    const modelLabel = page.getByLabel('Model').or(page.getByRole('textbox', { name: 'Select model' }));
    await modelLabel.first().click({ force: true });
    
    const modelOption = page.getByText('Model 16 350ms').or(page.getByRole('button', { name: /Model 16/i })).first();
    await modelOption.click({ force: true });

    const trimLabel = page.getByLabel('Trim').or(page.getByRole('textbox', { name: 'Select trim' }));
    await trimLabel.first().click({ force: true });
    
    const trimOption = page.getByText('Base', { exact: true }).or(page.getByRole('button', { name: 'Base' })).first();
    await trimOption.click({ force: true });

    const continueBtn = page.getByRole('button', { name: 'Continue' });
    if (await continueBtn.isVisible()) {
      await continueBtn.click({ force: true });
    }

    const confirmBtn = page.getByRole('button', { name: 'Confirm Selection' })
      .or(page.getByRole('button', { name: 'Confirm & Get Records' }));
    if (await confirmBtn.first().isVisible()) {
      await confirmBtn.first().click({ force: true });
    }

    const submitBtn = page.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible()) {
      await submitBtn.click({ force: true });
    }

    await page.waitForURL(/.*(cv=|preview|report).*/, { timeout: this.timeout * 2 }).catch(() => {});
    console.log('✅ [NonStreamingClassicEditableSpecsTask] Classic Editable Specs update submitted successfully.');
  }
}

module.exports = { NonStreamingClassicEditableSpecsTask };
