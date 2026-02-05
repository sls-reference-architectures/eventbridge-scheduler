import { ScheduleType } from '../../src/common/constants';
import { fetchScheduleById } from '../../src/repositories/eventBridgeScheduler';
import * as Given from '../bdd/given';

describe('When fetching a schedule by ID', () => {
  describe('that exists', () => {
    it('should return the schedule details', async () => {
      // ARRANGE
      const tenant = Given.anId();
      const { id, executionInput } = await Given.aOneTimeSchedule(tenant);

      // ACT
      const schedule = await fetchScheduleById({ id, tenant });

      // ASSERT
      expect(schedule.executionInput).toEqual(executionInput);
      expect(schedule.id).toEqual(id);
      expect(schedule.tenant).toEqual(tenant);
      expect(schedule.type).toEqual(ScheduleType.ONE_TIME);
    });
  });

  describe('that does not exist', () => {
    it('should throw a Not Found error', async () => {
      // ARRANGE
      const tenant = Given.anId();
      const id = Given.anId();

      // ACT & ASSERT
      await expect(fetchScheduleById({ id, tenant })).rejects.toThrow(/not found/i);
    });
  });
});
