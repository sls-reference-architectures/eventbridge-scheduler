import { createRateBasedSchedule } from '../../src/repositories/eventBridgeScheduler.js';
import { buildRateBasedScheduleInput } from '../common/testDataGenerators.js';

describe.skip('When creating a rate-based schedule', () => {
  it('should return success', async () => {
    // ARRANGE
    const now = new Date().toISOString();
    const rateBasedScheduleInput = buildRateBasedScheduleInput({ executionTimestamp: now });

    // ACT
    const result = await createRateBasedSchedule(rateBasedScheduleInput);

    // ASSERT
    expect(result).toHaveProperty('id');
    expect(result.id).toBeString();
  });
});
