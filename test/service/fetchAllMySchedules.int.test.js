import { fetchAllSchedules } from '../../src/repositories/eventBridgeScheduler';
import * as Given from '../bdd/given';

describe('When fetching all schedules for a tenant', () => {
  it('should return only schedules for that tenant', async () => {
    // ARRANGE
    const schedule = await Given.aOneTimeSchedule();
    await Given.aOneTimeSchedule();

    // ACT
    const tenant1SchedulesResult = await fetchAllSchedules({ tenant: schedule.tenant });

    // ASSERT
    expect(tenant1SchedulesResult.results).toBeArray();
    expect(tenant1SchedulesResult.results).toHaveLength(1);
    expect(tenant1SchedulesResult.results[0].id).toEqual(schedule.id);
  });
});
