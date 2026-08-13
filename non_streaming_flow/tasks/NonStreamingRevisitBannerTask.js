// non_streaming_flow/tasks/NonStreamingRevisitBannerTask.js
const { expect } = require('@playwright/test');

class NonStreamingRevisitBannerTask {
  async perform(page) {
    console.log('🔄 [NonStreamingRevisitBannerTask] Navigating back to base URL using browser back button...');
    
    // 1. Navigate back to base URL using browser back
    await page.goBack();
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const timeout = process.env.CI ? 90000 : 60000;
    
    // 2. Locate dynamic 'Grab it for' or 'Grab it now' button based on HomePage.js locators
    const grabItButton = page.locator('button:has-text("Grab it now")')
      .or(page.locator('button:has-text("Grab it for")'))
      .or(page.getByRole('button', { name: /Grab it/i }))
      .or(page.locator('.revisit-banner button, [class*="revisit"] button'));
    
    try {
      console.log(`[NonStreamingRevisitBannerTask] Waiting for Revisit Grab It button on: ${page.url()}`);
      
      // Wait for button to appear and immediately click it
      await grabItButton.first().waitFor({ state: 'visible', timeout: timeout });
      console.log('[NonStreamingRevisitBannerTask] Revisit button visible - clicking immediately');
      
      await grabItButton.first().click({ force: true });
    } catch (e) {
      console.error('[NonStreamingRevisitBannerTask] Grab it button issue:', e.message);
      throw e;
    }

    // 3. Verify navigation to preview page with specific query parameters
    await page.waitForURL(/.*preview.*/, { timeout: timeout });
    await expect(page).toHaveURL(/.*(type=vhr|preview).*/);
    
    console.log('✅ [NonStreamingRevisitBannerTask] Passed: Revisit banner flow verified.');
  }
}

module.exports = { NonStreamingRevisitBannerTask };
