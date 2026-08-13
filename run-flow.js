// run-flow.js
const { execSync } = require('child_process');
const { execSync: detect } = require('child_process');

function runFlow() {
  console.log('🚀 Running Single Flow Detection...');
  let flowType = 'streaming';

  try {
    const output = execSync('node detect-flow.js', { encoding: 'utf8' });
    console.log(output);
    if (output.includes('Detected Checkout Flow : non_streaming')) {
      flowType = 'non_streaming';
    } else if (output.includes('Detected Checkout Flow : streaming')) {
      flowType = 'streaming';
    }
  } catch (e) {
    console.error('❌ Flow Detection Failed. Stopping execution.');
    process.exit(1);
  }

  const rawArgs = process.argv.slice(2);
  const formattedArgs = rawArgs.map(arg => {
    if (arg.includes(' ') || arg.includes('(') || arg.includes(')') || arg.includes('|')) {
      return `'${arg.replace(/'/g, "'\\''")}'`;
    }
    return arg;
  }).join(' ');

  if (flowType === 'non_streaming') {
    console.log('🎯 Launching Non-Streaming Suite: non_streaming_flow/nonstreaming.spec.js');
    execSync(`npx playwright test non_streaming_flow/nonstreaming.spec.js ${formattedArgs}`, { stdio: 'inherit' });
  } else {
    console.log('🎯 Launching Streaming Suite: tests/streaming2-e2e.spec.js');
    execSync(`npx playwright test tests/streaming2-e2e.spec.js ${formattedArgs}`, { stdio: 'inherit' });
  }
}

runFlow();
