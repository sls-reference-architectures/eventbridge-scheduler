import {
  ONE_TIME_SCHEDULE_CODE,
  RATE_BASED_SCHEDULE_CODE,
  ScheduleType,
} from '../../src/common/constants';
import { getTypeCode } from '../../src/transformers/commonTransformers';

describe('When translating a schedule type to a code', () => {
  describe('of type one-time', () => {
    it('should return the correct code', () => {
      // ARRANGE
      const scheduleType = ScheduleType.ONE_TIME;

      // ACT
      const typeCode = getTypeCode(scheduleType);

      // ASSERT
      expect(typeCode).toEqual(ONE_TIME_SCHEDULE_CODE);
    });
  });

  describe('of type rate-based', () => {
    it('should return the correct code', () => {
      // ARRANGE
      const scheduleType = ScheduleType.RATE_BASED;

      // ACT
      const typeCode = getTypeCode(scheduleType);

      // ASSERT
      expect(typeCode).toEqual(RATE_BASED_SCHEDULE_CODE);
    });
  });

  describe('with an unknown schedule type', () => {
    it('should throw a Bad Request error', () => {
      // ARRANGE
      const invalidScheduleType = 'invalid-type';

      // ACT & ASSERT
      expect(() => getTypeCode(invalidScheduleType)).toThrow(/bad request/i);
    });
  });
});
