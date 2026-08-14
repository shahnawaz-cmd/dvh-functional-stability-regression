const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://detailedvehiclehistory.com/vin-check/preview?vin=WA1BNAFY8J2112578&wpPage=homepage&type=vhr', { waitUntil: 'domcontentloaded' });
  
  await page.getByRole('button', { name: /Access Record|Get Window Sticker|View Full Report/i }).first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  
  const planElements = await page.evaluate(() => {
    // Find containers under "Choose your package" section
    const all = Array.from(document.querySelectorAll('*'));
    return all.filter(el => {
      const txt = (el.innerText || '').replace(/\s+/g, ' ');
      return (txt.includes('Report') || txt.includes('Unlimited')) && txt.includes('You pay') && el.children.length < 6;
    }).map(el => ({
      tag: el.tagName,
      cls: String(el.className),
      role: el.getAttribute('role'),
      text: el.innerText.replace(/\s+/g, ' ').slice(0, 100)
    }));
  });

  console.log('=== EXACT PLAN CARD CONTAINERS ===');
  console.log(JSON.stringify(planElements, null, 2));

  await browser.close();
})();
