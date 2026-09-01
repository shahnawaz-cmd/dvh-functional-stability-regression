# DVH Functional Stability Regression & Streaming Flow Automation

Automated End-to-End (E2E) testing framework for vehicle history report (VHR) and window sticker streaming flows built with [Playwright](https://playwright.dev/) and [Allure Report](https://allurereport.org/).

---

## 🚀 Features

- **Cross-Browser & Multi-Device Testing**: Supports Desktop Chrome and Mobile Chrome (emulated mobile viewport & user agent).
- **Batched Test Execution**: Structured batch scripts for parallel and multi-worker execution.
- **E2E Flow Validations**:
  - 17-character standard & Classic VIN decoding
  - 100% dynamic classic Year (1960–1980), Make, Model, and Trim database option capture
  - 2-step modal confirmation (`Continue` ➔ `Confirm & Get Records`) with backend API synchronization
  - Interactive spec popups and editable classic YMM specs
  - Revisit banner triggers and navigation
  - Exit-intent popups and discount offer redemption
  - VHR & Window Sticker upsell text matching
  - Default plan setting verification
  - Zero-bounce unique email generation with 2-digit sub-addressing (`user+42@gmail.com`)
- **Dual Reporting Architecture**:
  - **Allure Report**: Rich visual reporting with test step details, JSON data attachments, DOM screenshot evidence, and historical trends.
  - **Playwright HTML Report**: Built-in test runner report with step-by-step traces and videos on failure.
- **CI/CD Integration & GitHub Pages**:
  - Automated dual report aggregation published to **GitHub Pages**.
  - Automated Slack alerts with formatted execution summaries.

---

## 🛠️ Project Structure

```
├── .github/
│   └── workflows/
│       └── playwright.yml    # CI/CD workflow (dual report deployment to gh-pages)
├── tests/
│   ├── helpers/              # API response capturing & utility helpers
│   ├── pages/                # Page Object Model (POM) classes
│   │   ├── HomePage.js       # Search & VIN decode flow
│   │   ├── PreviewPage.js    # Plans, upsells, YMM & Specs modals, email flow
│   │   ├── CheckoutPage.js   # Stripe / PayPal checkout interactions
│   │   └── CouponFlowHandler.js # Promo coupons & order summary verifications
│   └── streaming2-e2e.spec.js # E2E Test Suite
├── allure-results/           # Raw Allure test result artifacts
├── allure-report/            # Generated static HTML Allure report
├── playwright-report/        # Playwright HTML report output
├── playwright.config.js      # Playwright & Allure reporter configuration
├── run-flow.js               # Dynamic flow detector runner
├── slack-notify.js           # Slack Webhook notification script
├── package.json              # Node dependencies & runner scripts
└── README.md                 # Project documentation
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahnawaz-cmd/dvh-functional-stability-regression.git
   cd dvh-functional-stability-regression
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install chromium
   ```

4. **Environment Configuration**:
   Create or verify your `.env` file in the root directory:
   ```env
   BASE_URL=https://detailedvehiclehistory.com/
   SLACK_WEBHOOK_URL=your_slack_webhook_url_here
   ```

---

## 🧪 Running Tests

### Standard Test Execution
Run all active tests:
```bash
npm test
```

### Run by Specific Test Case
```bash
# Classic YMM & Specs tests
npx playwright test tests/streaming2-e2e.spec.js --grep="TC_(13|14|15)_"

# Home to Checkout Price, Coupon & Email Cache
npx playwright test tests/streaming2-e2e.spec.js --grep="TC_08_"
```

### Desktop Batches
```bash
npm run test:desktop:batch:1
npm run test:desktop:batch:2
npm run test:desktop:batch:3
```

### Mobile Batches
```bash
npm run test:mobile:batch:1
npm run test:mobile:batch:2
npm run test:mobile:batch:3
```

---

## 📊 Allure & Playwright Reporting

This project uses a **dual reporting system** combining **Allure Report** and **Playwright HTML Report** for maximum visibility and debugging.

### 1. Allure Report (Recommended)
Allure captures detailed test steps, execution timing, JSON payloads, and post-update screenshots.

- **Generate and serve Allure report live in your browser**:
  ```bash
  npm run allure:serve
  ```

- **Generate static report folder**:
  ```bash
  npm run allure:generate
  ```

- **Open previously generated report**:
  ```bash
  npm run allure:open
  ```

#### What's Included in Allure Reports:
- 📋 **JSON Data Attachments**:
  - `TC_13_Selected_YMM_Data`: Real database Year, Make, Model, Trim captured dynamically from the DOM.
  - `TC_14_Manual_Specs_Data`: Dynamic manual specs input values.
  - `TC_15_Updated_Specs_Data`: Dynamic 8-field editable specs values.
  - `TC_08_Full_Checkout_Price_Coupon_Email_Cache_Summary`: Complete plan, coupon discount, and cached email verification summary.
- 📸 **Screenshot Attachments**:
  - `TC_13_Updated_Frontend_Screenshot.png`: Screenshot of the preview page after YMM update confirmation.
  - `TC_14_Updated_Frontend_Screenshot.png`: Screenshot of the preview page after manual specs update.
  - `TC_15_Updated_Frontend_Screenshot.png`: Screenshot of the preview page after editable specs update.

---

### 2. Playwright HTML Report
- **View local Playwright report**:
  ```bash
  npx playwright show-report
  ```

---

### 3. CI/CD GitHub Pages Deployment
On every CI run in GitHub Actions:
- Playwright HTML Report is deployed to the root: `https://<username>.github.io/<repo>/`
- Allure Report is deployed under `/allure/`: `https://<username>.github.io/<repo>/allure/`
- Both reports are linked from a shared navigation banner for one-click access.

---

## 🔔 Slack Notifications
Post-execution Slack notifications can be dispatched using:
```bash
node slack-notify.js
```
The script reads `test-results.json` and posts a summary block with total tests, passed count, failed count, duration, and direct report links.
