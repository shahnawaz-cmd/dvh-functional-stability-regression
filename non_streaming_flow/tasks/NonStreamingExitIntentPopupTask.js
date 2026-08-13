// non_streaming_flow/tasks/NonStreamingExitIntentPopupTask.js
const { expect } = require('@playwright/test');

class NonStreamingExitIntentPopupTask {
  async perform(page) {
    console.log('🚪 [NonStreamingExitIntentPopupTask] Simulating mouse movements to trigger Exit Intent Pop-up...');

    // Scroll and mouse movement logic to simulate human behavior
    await page.mouse.move(640, 400, { steps: 10 });
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);

    await page.mouse.move(400, 600, { steps: 10 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 400, { steps: 10 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 200, { steps: 15 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 100, { steps: 15 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 10,  { steps: 10 });
    await page.waitForTimeout(300);

    // Dispatch mouse events on the document and window
    await page.evaluate(() => {
      const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
      document.dispatchEvent(new MouseEvent('mouseleave', opts));
      document.dispatchEvent(new MouseEvent('mouseout',   opts));
      window.dispatchEvent(new MouseEvent('mouseleave',   opts));
      document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
    });

    await page.waitForTimeout(3000);

    // Check for the pop-up buttons (including 'Redeem 15% off' as well as standard variants)
    const redeem15Btn = page.getByRole('button', { name: 'Redeem 15% off' });
    const claim15Btn = page.getByRole('button', { name: 'Claim 15% Off' });
    const redeemBtn = page.getByRole('button', { name: 'Click here to redeem instantly' });
    const take15Btn = page.getByRole('button', { name: 'Take 15% off' });
    
    // Combine locators for complete resilience across sites & environments
    const popupBtn = redeem15Btn.or(claim15Btn).or(redeemBtn).or(take15Btn);
    
    const timeout = process.env.CI ? 20000 : 15000;
    
    await expect(popupBtn.first()).toBeVisible({ timeout: timeout });
    await popupBtn.first().click();
    console.log('✅ [NonStreamingExitIntentPopupTask] Clicked exit intent pop-up button.');
  }
}

module.exports = { NonStreamingExitIntentPopupTask };
