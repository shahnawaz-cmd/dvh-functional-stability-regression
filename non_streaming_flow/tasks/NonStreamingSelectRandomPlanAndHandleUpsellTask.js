// non_streaming_flow/tasks/NonStreamingSelectRandomPlanAndHandleUpsellTask.js
const { expect } = require('@playwright/test');

class NonStreamingSelectRandomPlanAndHandleUpsellTask {
  constructor(timeout = process.env.CI ? 60000 : 30000) {
    this.timeout = timeout;
  }

  async perform(page, options = {}) {
    console.log('🏷️ [NonStreamingSelectRandomPlanAndHandleUpsellTask] Selecting plan card on Preview page...');

    // 1. Locate all dynamic plan cards with role="radio"
    const planCards = page.locator('div[role="radio"]');
    await planCards.first().waitFor({ state: 'visible', timeout: this.timeout });

    const totalPlansCount = await planCards.count();
    console.log(`🔍 Dynamically detected ${totalPlansCount} plan cards on Preview page.`);

    if (totalPlansCount === 0) {
      throw new Error('❌ No plan cards with role="radio" found on Preview page.');
    }

    // 2. Target UVC plan explicitly if forceUVC option is set, otherwise pick randomly
    let randomIndex = -1;

    if (options.forceUVC) {
      console.log('🎯 Explicit testing mode: Searching for UVC (Unlimited VIN Check) plan card...');
      for (let i = 0; i < totalPlansCount; i++) {
        const text = await planCards.nth(i).innerText();
        if (text.toLowerCase().includes('unlimited') || text.toLowerCase().includes('uvc')) {
          randomIndex = i;
          break;
        }
      }
      if (randomIndex === -1) {
        console.log('⚠️ UVC card text not found explicitly, falling back to last card (index 3).');
        randomIndex = totalPlansCount - 1;
      }
    } else {
      randomIndex = Math.floor(Math.random() * totalPlansCount);
    }

    const chosenPlanCard = planCards.nth(randomIndex);

    await chosenPlanCard.scrollIntoViewIfNeeded();
    await chosenPlanCard.waitFor({ state: 'visible', timeout: 5000 });

    const rawText = await chosenPlanCard.innerText();
    const cleanText = rawText.replace(/\s+/g, ' ').trim();

    const titleLines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const planTitle = titleLines[0] || cleanText.slice(0, 30);

    // Click the target plan card
    await chosenPlanCard.click({ force: true });
    console.log(`✅ Selected plan card #${randomIndex + 1} of ${totalPlansCount}: Title="${planTitle}"`);

    // 3. Handle Auto-Selected / Optional Upsell Checkbox
    const isUVC = planTitle.toLowerCase().includes('unlimited') || cleanText.toLowerCase().includes('unlimited');
    let upsellActive = false;

    if (isUVC) {
      console.log('ℹ️ Unlimited VIN Check (UVC) selected: Upsell is automatically disabled.');
    } else {
      const upsellCheckbox = page.getByRole('checkbox').first();
      const isVisible = await upsellCheckbox.isVisible().catch(() => false);
      
      if (isVisible) {
        const isChecked = await upsellCheckbox.isChecked().catch(() => false);
        if (!isChecked) {
          await upsellCheckbox.check({ force: true }).catch(() => {});
        }
        upsellActive = true;
        console.log('✅ Upsell option is ACTIVE (Auto-selected by default for non-UVC plan).');
      } else {
        console.log('ℹ️ Upsell checkbox not visible on DOM.');
      }
    }

    return {
      planIndex: randomIndex + 1,
      totalPlansAvailable: totalPlansCount,
      planTitle,
      isUVC,
      upsellActive
    };
  }
}

module.exports = { NonStreamingSelectRandomPlanAndHandleUpsellTask };
