const fs = require('fs');
const https = require('https');
const url = require('url');

let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;
let totalFlaky = 0;

const failedTestNames = [];

let detectedFlowName = 'Streaming'; // Default

const scanDir = (dir) => {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
        const fullPath = `${dir}/${entry.name}`;
        if (entry.isDirectory()) {
            files = files.concat(scanDir(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('-results.json') || entry.name.endsWith('.json'))) {
            files.push(fullPath);
        }
    }
    return files;
};

const allReportFiles = [...scanDir('playwright-report'), ...scanDir('downloaded-artifacts')];

if (allReportFiles.some(f => f.includes('non-streaming'))) {
    detectedFlowName = 'Non-Streaming';
} else if (allReportFiles.some(f => f.includes('streaming'))) {
    detectedFlowName = 'Streaming';
}

for (const filePath of allReportFiles) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const stats = data.stats;
            if (stats) {
                totalPassed += stats.expected || 0;
                totalFailed += stats.unexpected || 0;
                totalSkipped += stats.skipped || 0;
                totalFlaky += stats.flaky || 0;
            }

            // Extract failed test case titles recursively
            const findFailedTests = (suites) => {
                for (const suite of suites || []) {
                    for (const spec of suite.specs || []) {
                        for (const testItem of spec.tests || []) {
                            if (testItem.status === 'unexpected') {
                                const projectName = testItem.projectName ? `[${testItem.projectName}] ` : '';
                                const testTitle = `${projectName}${spec.title}`;
                                if (!failedTestNames.includes(testTitle)) {
                                    failedTestNames.push(testTitle);
                                }
                            }
                        }
                    }
                    if (suite.suites) {
                        findFailedTests(suite.suites);
                    }
                }
            };
            findFailedTests(data.suites);
        } catch (e) {
            console.error(`Error reading ${filePath}:`, e);
        }
    }

// Flaky tests passed on retry, so they count towards successful executions, not failures
const totalTests = totalPassed + totalFailed + totalSkipped + totalFlaky;

// Overall status is PASS if totalFailed is 0
const overallStatus = (totalFailed === 0) ? '✅ PASS' : '❌ FAIL';
let slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

if (totalFailed > 0) {
    console.log(`⚠️ Test run had ${totalFailed} failure(s). Routing full message to SLACK_FAILURE_WEBHOOK_URL.`);
    slackWebhookUrl = process.env.SLACK_FAILURE_WEBHOOK_URL || slackWebhookUrl;
}

if (!slackWebhookUrl) {
    console.log('No Slack Webhook URL is set. Printing payload for local verification:');
}

const githubServer = process.env.GITHUB_SERVER || 'https://github.com';
const githubRepo = process.env.GITHUB_REPO || 'shahnawaz-cmd/dvh-functional-stability-regression';
const githubRun = process.env.GITHUB_RUN || '0';
const githubActor = process.env.GITHUB_ACTOR || 'local';
const githubRef = process.env.GITHUB_REF || 'local';
const githubEvent = process.env.GITHUB_EVENT || 'push';
const githubSha = process.env.GITHUB_SHA_VAL || 'local';

const now = new Date();
const runTimeStr = now.toUTCString();

const tagText = (totalFailed > 0) ? ' (Attention: <@U09UE83AWGP>)' : '';

const failedSection = (failedTestNames.length > 0)
  ? `\n\n*❌ Failed Test Cases (${failedTestNames.length}):*\n` + failedTestNames.map(name => `• \`${name}\``).join('\n')
  : '';

const pagesBaseUrl = `https://${githubRepo.split('/')[0]}.github.io/${githubRepo.split('/')[1]}`;

const payload = {
    blocks: [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "🚀 dvh-functional-flow-ci – Cross Browser Test Perform",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*QA Test Suite for ${detectedFlowName} Flow Validation Completed (${githubEvent === 'schedule' ? 'Scheduled Run' : 'Push/Manual Run'}).*\n\n*Overall Status:* ${overallStatus}${tagText}\n\n*📊 Test Results Summary:*\n• *Total Tests:* ${totalTests}\n• *✅ Passed:* ${totalPassed}\n• *❌ Failed:* ${totalFailed}\n• *⏭️ Skipped:* ${totalSkipped}\n• *⚠️ Flaky:* ${totalFlaky}${failedSection}\n\n*📅 Run Time:* \`${runTimeStr}\`\n*Branch:* \`${githubRef}\`\n*Triggered by:* \`${githubActor}\`\n*Event:* \`${githubEvent}\`\n*Commit:* \`${githubSha}\`\n\n🔗 <${githubServer}/${githubRepo}/actions/runs/${githubRun}|View Workflow Run>\n🌐 <${pagesBaseUrl}/|View Playwright HTML Report>\n📊 <${pagesBaseUrl}/allure/|View Allure Report>`
            }
        }
    ]
};

const payloadString = JSON.stringify(payload, null, 2);

if (!slackWebhookUrl || slackWebhookUrl === 'local') {
    console.log(payloadString);
    process.exit(0);
}

const webhookUrl = new url.URL(slackWebhookUrl);

const options = {
    hostname: webhookUrl.hostname,
    port: 443,
    path: webhookUrl.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString)
    }
};

const req = https.request(options, (res) => {
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error('Error sending slack notification:', e);
});

req.write(payloadString);
req.end();
