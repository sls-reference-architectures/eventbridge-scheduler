import { ScheduleType } from '../../src/common/constants';
import { fetchAllOneTimeSchedules } from '../../src/repositories/eventBridgeScheduler';
import * as Given from '../bdd/given';

describe('When fetching all one-time schedules for a tenant', () => {
  it('should return only one-time schedules for that tenant', async () => {
    // ARRANGE
    const tenant = Given.anId();
    const schedule = await Given.aOneTimeSchedule(tenant);
    await Given.aRateBasedSchedule(tenant);
    await Given.aOneTimeSchedule();

    // ACT
    const tenant1SchedulesResult = await fetchAllOneTimeSchedules({ tenant: schedule.tenant });

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
      await Given.aRateBasedSchedule(tenant);

      // ACT
      const schedulesResult = await fetchAllOneTimeSchedules({ tenant, limit: 1 });

      // ASSERT
      console.log(schedulesResult);
      expect(schedulesResult.results).toBeArray();
      expect(schedulesResult.results).toHaveLength(1);
      expect(schedulesResult.results[0].type).toEqual(ScheduleType.ONE_TIME);
      expect(schedulesResult.next).toBeString();
    });

    it('should return the next page of results when a next token is provided', async () => {
      // ARRANGE
      const tenant = Given.anId();
      const { id: oneTimeSchedule1Id } = await Given.aOneTimeSchedule(tenant);
      const { id: oneTimeSchedule2Id } = await Given.aOneTimeSchedule(tenant);
      await Given.aRateBasedSchedule(tenant);

      // ACT
      const firstPageResult = await fetchAllOneTimeSchedules({ tenant, limit: 1 });
      const secondPageResult = await fetchAllOneTimeSchedules({
        tenant,
        limit: 1,
        next: firstPageResult.next,
      });

      // ASSERT
      expect(firstPageResult.results).toBeArray();
      expect(firstPageResult.results).toHaveLength(1);
      expect(firstPageResult.results[0].type).toEqual(ScheduleType.ONE_TIME);
      expect(firstPageResult.next).toBeString();

      expect(secondPageResult.results).toBeArray();
      expect(secondPageResult.results).toHaveLength(1);
      expect(secondPageResult.results[0].type).toEqual(ScheduleType.ONE_TIME);
      expect(secondPageResult.next).toBeUndefined();

      expect(firstPageResult.results[0].id).not.toEqual(secondPageResult.results[0].id);
      expect([oneTimeSchedule1Id, oneTimeSchedule2Id]).toContain(firstPageResult.results[0].id);
      expect([oneTimeSchedule1Id, oneTimeSchedule2Id]).toContain(secondPageResult.results[0].id);
    });
  });
});
