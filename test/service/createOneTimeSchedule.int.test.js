import { createOneTimeSchedule } from '../../src/repositories/eventBridgeScheduler.js';
import { buildOneTimeScheduleInput } from '../common/testDataGenerators.js';

describe('When creating a one-time schedule', () => {
  it('should return success', async () => {
    // ARRANGE
    const oneTimeScheduleInput = buildOneTimeScheduleInput();

    // ACT
    const result = await createOneTimeSchedule(oneTimeScheduleInput);

    // ASSERT
    expect(result).toBeDefined();
  });
});
