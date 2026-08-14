// non_streaming_flow/tasks/NonStreamingCouponFlowTask.js
const { expect } = require('@playwright/test');

class NonStreamingCouponFlowTask {
  async verifyCoupon(page, couponCode, expectedDiscount) {
    console.log(`--- Applying Coupon: ${couponCode} ---`);
    await page.goto(`/?offer=${couponCode}`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000); // Stabilization before cookie check

    // 1. Verify Cookie
    const cookies = await page.context().cookies([page.url()]);
    const couponCookie = cookies.find(c => c.name === 'coupon');
    if (!couponCookie) {
      throw new Error(`Failed: Coupon cookie not found for offer ${couponCode}.`);
    }
    console.log(`Passed: Cookie found. Name: ${couponCookie.name}, Value: ${couponCookie.value}`);

    // 2. Verify Banner with dynamic discount text
    const bannerLocator = page.locator(`text=You have received ${expectedDiscount} Discount!`);
    await expect(bannerLocator).toBeVisible({ timeout: 10000 });
    console.log(`Passed: Banner appeared with text: "You have received ${expectedDiscount} Discount!"`);
  }

  async verifyLowToHighCouponFlow(page) {
    console.log('--- Executing Low to High Coupon Flow Validation ---');
    // 1. Apply low discount coupon (preview15)
    await this.verifyCoupon(page, 'preview15', '15%');
    const firstCouponVal = (await page.context().cookies()).find(c => c.name === 'coupon')?.value;

    // 2. Apply high discount coupon (get20)
    console.log('--- Applying Higher Coupon: get20 ---');
    await page.goto('/?offer=get20');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    
    // Verify cookies: coupon should be get20, prev_coupon should be preview15
    const cookies = await page.context().cookies();
    const couponCookie = cookies.find(c => c.name === 'coupon');
    const prevCouponCookie = cookies.find(c => c.name === 'prev_coupon');
    
    if (couponCookie?.value !== 'get20' || prevCouponCookie?.value !== firstCouponVal) {
      throw new Error(`Failed: Cookie verification failed. Coupon: ${couponCookie?.value}, Prev: ${prevCouponCookie?.value}`);
    }
    console.log('Passed: Cookie verification (coupon=get20, prev_coupon=preview15)');

    // 3. Verify Banner for high coupon (20%)
    await expect(page.locator('text=You have received 20% Discount!')).toBeVisible({ timeout: 10000 });
    console.log('Passed: Banner showed 20% Discount.');

    // 4. Apply low coupon again (preview15) - High should remain active
    console.log('--- Re-applying 15% coupon to verify non-override protection ---');
    await page.goto('/?offer=preview15');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    // Expected: Banner should still show 20% (highest coupon not overridden)
    await expect(page.locator('text=You have received 20% Discount!')).toBeVisible({ timeout: 5000 });
    console.log('Passed: Highest coupon (20%) was NOT overridden by lower coupon.');
  }

  async verifyCouponBannerOnOtherPages(page) {
    console.log('--- Executing Coupon Banner Persistence Validation Across Pages ---');
    // 1. Apply coupon on homepage
    await this.verifyCoupon(page, 'preview15', '15%');

    // 2. Try accessible sub-paths
    const paths = ['/window-stickers', '/window-sticker'];
    let validPath = null;
    
    for (const path of paths) {
      const response = await page.goto(path);
      if (response && response.status() === 200) {
        validPath = path;
        break;
      }
    }

    if (!validPath) {
      throw new Error('Failed: Neither /window-stickers nor /window-sticker paths are accessible.');
    }

    console.log(`Passed: Navigated to valid sub-path: ${validPath}`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    // 3. Verify banner is still visible
    const bannerLocator = page.locator('text=You have received 15% Discount!');
    await expect(bannerLocator).toBeVisible({ timeout: 5000 });
    console.log(`Passed: Banner persisted on page ${validPath}`);
  }
}

module.exports = { NonStreamingCouponFlowTask };
