// non_streaming_flow/tasks/CalculateVinDecodeTimeTask.js
const { test } = require('@playwright/test');
const { NonStreamingVinDecoder } = require('./NonStreamingVinDecoder');

class CalculateVinDecodeTimeTask {
  static async execute(page, options = {}) {
    const decoder = new NonStreamingVinDecoder(options);

    console.log('⏱️ [CalculateVinDecodeTimeTask] Starting VIN decode time tracking...');
    const startTime = Date.now();

    const result = await decoder.perform(page, options);
    const vin = typeof result === 'object' ? result.vin : result;

    const endTime = Date.now();
    const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);

    console.log('--------------------------------------------------');
    console.log(`⏱️ VIN Decode Time: ${durationSeconds} seconds`);
    console.log(`🚗 Decoded VIN     : ${vin}`);
    console.log('--------------------------------------------------');

    // Attach to Playwright HTML Report annotations
    try {
      test.info().annotations.push({
        type: '⏱️ Decode Time (sec)',
        description: `${durationSeconds} seconds`
      });
      test.info().annotations.push({
        type: '🚗 Decoded VIN',
        description: vin
      });
    } catch (e) {
      // Safe fallback if called outside active test context
    }

    return {
      vin,
      durationSeconds
    };
  }
}

module.exports = { CalculateVinDecodeTimeTask };
