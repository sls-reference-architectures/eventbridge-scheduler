import retry from 'async-retry';

import { ScheduleType } from '../../src/common/constants';
import { fetchAllRateBasedSchedules } from '../../src/repositories/eventBridgeScheduler';
import * as Given from '../bdd/given';

describe('When fetching all rate-based schedules for a tenant', () => {
  it('should return only rate-based schedules for that tenant', async () => {
    // ARRANGE
    const tenant = Given.anId();
    const schedule = await Given.aRateBasedSchedule(tenant);
    await Given.aOneTimeSchedule(tenant);
    await Given.aOneTimeSchedule();

    // ACT
    const tenant1SchedulesResult = await fetchAllRateBasedSchedules({ tenant: schedule.tenant });

    // ASSERT
    expect(tenant1SchedulesResult.results).toBeArray();
    expect(tenant1SchedulesResult.results).toHaveLength(1);
    expect(tenant1SchedulesResult.results[0].id).toEqual(schedule.id);
  });

  describe('with paging', () => {
    it('should respect the limit parameter', async () => {
      // ARRANGE
      const tenant = Given.anId();
      await Given.aRateBasedSchedule(tenant);
      await Given.aRateBasedSchedule(tenant);
      await Given.aOneTimeSchedule(tenant);

      // ACT
      const schedulesResult = await fetchAllRateBasedSchedules({ tenant, limit: 1 });

      // ASSERT
      expect(schedulesResult.results).toBeArray();
      expect(schedulesResult.results).toHaveLength(1);
      expect(schedulesResult.results[0].type).toEqual(ScheduleType.RATE_BASED);
      expect(schedulesResult.next).toBeString();
    });

    it('should return the next page of results when a next token is provided', async () => {
      // ARRANGE
      const tenant = Given.anId();
      const { id: rateBasedSchedule1Id } = await Given.aRateBasedSchedule(tenant);
      const { id: rateBasedSchedule2Id } = await Given.aRateBasedSchedule(tenant);
      await Given.aOneTimeSchedule(tenant);

      await retry(
        async () => {
          // ACT
          const firstPageResult = await fetchAllRateBasedSchedules({ tenant, limit: 1 });
          const secondPageResult = await fetchAllRateBasedSchedules({
            tenant,
            limit: 1,
            next: firstPageResult.next,
          });

          // ASSERT
          expect(firstPageResult.results).toBeArray();
          expect(firstPageResult.results).toHaveLength(1);
          expect(firstPageResult.results[0].type).toEqual(ScheduleType.RATE_BASED);
          expect(firstPageResult.next).toBeString();

          expect(secondPageResult.results).toBeArray();
          expect(secondPageResult.results).toHaveLength(1);
          expect(secondPageResult.results[0].type).toEqual(ScheduleType.RATE_BASED);
          expect(secondPageResult.next).toBeUndefined();

          expect(firstPageResult.results[0].id).not.toEqual(secondPageResult.results[0].id);
          expect([rateBasedSchedule1Id, rateBasedSchedule2Id]).toContain(
            firstPageResult.results[0].id,
          );
          expect([rateBasedSchedule1Id, rateBasedSchedule2Id]).toContain(
            secondPageResult.results[0].id,
          );
        },
        { retries: 3 },
      );
    });
  });
});
