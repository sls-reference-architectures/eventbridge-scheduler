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

  describe('with paging', () => {
    it('should respect the limit parameter', async () => {
      // ARRANGE
      const tenant = Given.anId();
      await Given.aOneTimeSchedule(tenant);
      await Given.aOneTimeSchedule(tenant);

      // ACT
      const schedulesResult = await fetchAllSchedules({ tenant, limit: 1 });

      // ASSERT
      expect(schedulesResult.results).toBeArray();
      expect(schedulesResult.results).toHaveLength(1);
      expect(schedulesResult.next).toBeString();
    });
  });
});
