// non_streaming_flow/nonstreaming.spec.js
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../tests/pages/HomePage');

const { NonStreamingVinDecoder } = require('./tasks/NonStreamingVinDecoder');

// Non-Streaming Main Test Suite (Ready for test case definitions)
test.describe('Non-Streaming Main Test Suite', () => {
  test('TC_NS_01_Non_Streaming_VIN_Decode_Validation', async ({ page }) => {
    console.log('--- Executing Non-Streaming VIN Decode Task ---');
    const home = new HomePage(page);
    await home.navigate();
    
    const decoder = new NonStreamingVinDecoder();
    const vin = await decoder.perform(page);
    console.log(`Successfully decoded VIN in non-streaming flow: ${vin}`);
  });
});
