const fs = require('fs');
const https = require('https');
const url = require('url');

const files = [
    'playwright-report/batch1-results.json',
    'playwright-report/batch2-results.json',
    'playwright-report/batch3-results.json'
];

let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;
let totalFlaky = 0;

for (const file of files) {
    try {
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            const stats = data.stats;
            if (stats) {
                totalPassed += stats.expected || 0;
                totalFailed += stats.unexpected || 0;
                totalSkipped += stats.skipped || 0;
                totalFlaky += stats.flaky || 0;
            }
        } else {
            console.warn(`Report file not found: ${file}`);
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
    }
}

// Flaky tests passed on retry, so they count towards successful executions, not failures
const totalTests = totalPassed + totalFailed + totalSkipped + totalFlaky;

// Overall status is PASS if totalFailed is 0
const overallStatus = (totalFailed === 0) ? '✅ PASS' : '❌ FAIL';
const tagText = (totalFailed > 0) ? ' (Attention: <@U09UE83AWGP>)' : '';

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!slackWebhookUrl) {
    console.log('SLACK_WEBHOOK_URL is not set. Printing payload for local verification:');
}

const githubServer = process.env.GITHUB_SERVER || 'https://github.com';
const githubRepo = process.env.GITHUB_REPO || 'shahnawaz-cmd/dvh-functional-stability-regression';
const githubRun = process.env.GITHUB_RUN || '0';
const githubActor = process.env.GITHUB_ACTOR || 'local';
const githubRef = process.env.GITHUB_REF || 'local';
const githubEvent = process.env.GITHUB_EVENT || 'push';
const githubSha = process.env.GITHUB_SHA_VAL || 'local';

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
                text: `*QA Test Suite for Streaming Flow Validation Completed (${githubEvent === 'schedule' ? 'Scheduled Run' : 'Push/Manual Run'}).*\n\n*Overall Status:* ${overallStatus}${tagText}\n\n*📊 Test Results Summary:*\n• *Total Tests:* ${totalTests}\n• *✅ Passed:* ${totalPassed}\n• *❌ Failed:* ${totalFailed}\n• *⏭️ Skipped:* ${totalSkipped}\n• *⚠️ Flaky:* ${totalFlaky}\n\n*Branch:* \`${githubRef}\`\n*Triggered by:* \`${githubActor}\`\n*Event:* \`${githubEvent}\`\n*Commit:* \`${githubSha}\`\n\n🔗 <${githubServer}/${githubRepo}/actions/runs/${githubRun}|View Workflow Run>\n🌐 <https://${githubRepo.split('/')[0]}.github.io/${githubRepo.split('/')[1]}/|View Public HTML Report>`
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
