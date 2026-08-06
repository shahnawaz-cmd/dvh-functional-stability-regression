# DVH Functional Stability Regression & Streaming Flow Automation

Automated End-to-End (E2E) testing framework for vehicle history report (VHR) and window sticker streaming flows built with [Playwright](https://playwright.dev/).

---

## 🚀 Features

- **Cross-Browser & Multi-Device Testing**: Supports Desktop Chrome, Mobile Chrome, Mobile Edge, and Samsung Internet.
- **Batched Test Execution**: Structured batch scripts for parallel and multi-worker runs.
- **E2E Flow Validations**:
  - 17-character standard & Classic VIN decoding
  - Interactive spec popups and editable classic YMM specs
  - Revisit banner triggers and navigation
  - Exit-intent popups and discount offer redemption
  - VHR & Window Sticker upsell text matches
  - Default plan setting verification
- **CI/CD Integration & Slack Notifications**: Automated reporting via Playwright JSON stats with automated Slack alerts for CI/CD runs.

---

## 🛠️ Project Structure

```
├── .github/              # GitHub Actions CI/CD workflows
├── tests/
│   ├── helpers/          # API response capturing & utility helpers
│   ├── pages/            # Page Object Model (POM) classes
│   └── streaming2-e2e.spec.js # E2E Test Suite
├── .env                  # Environment configuration
├── playwright.config.js  # Playwright configuration
├── slack-notify.js       # Slack Webhook notification script
├── package.json          # Node dependencies & script runners
└── README.md             # Documentation
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
   npx playwright install
   ```

4. **Environment Configuration**:
   Create or verify your `.env` file in the root directory:
   ```env
   BASE_URL=https://your-target-domain.com
   SLACK_WEBHOOK_URL=your_slack_webhook_url_here
   ```

---

## 🧪 Running Tests

### Standard Test Execution
Run all active Playwright tests headlessly:
```bash
npm test
```

### Desktop Batches
Run Desktop Chrome test batches:
```bash
npm run test:desktop:batch:1
npm run test:desktop:batch:2
npm run test:desktop:batch:3
```

### Mobile Batches
Run Mobile browser test batches (Mobile Chrome, Mobile Edge, Samsung Internet):
```bash
npm run test:mobile:batch:1
npm run test:mobile:batch:2
npm run test:mobile:batch:3
```

---

## 📊 Reporting & Notifications

- **HTML Report**: Playwright HTML reports are generated automatically under `playwright-report/`. View locally with:
  ```bash
  npx playwright show-report
  ```
- **Slack Notifications**: Run `node slack-notify.js` post-test execution to send formatted summary blocks to Slack.
