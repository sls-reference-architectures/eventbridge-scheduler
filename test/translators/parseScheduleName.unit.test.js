import { ScheduleType } from '../../src/common/constants';
import { parseScheduleName } from '../../src/translators/scheduleTranslator';
import { buildTestId } from '../common/testDataGenerators';
describe('When parsing a schedule name', () => {
  describe('of type one-time', () => {
    it('should return the correct type', () => {
      // ARRANGE
      const oneTimeScheduleName = 'ABCDEF_OT_12345';

      // ACT
      const { type } = parseScheduleName(oneTimeScheduleName);

      // ASSERT
      expect(type).toEqual(ScheduleType.ONE_TIME);
    });
  });

  it('should return the id', () => {
    // ARRANGE
    const id = buildTestId();
    const scheduleName = `ABCDEF_OT_${id}`;

    // ACT
    const { id: parsedId } = parseScheduleName(scheduleName);

    // ASSERT
    expect(parsedId).toEqual(id);
  });

  it('should return the tenant', () => {
    // ARRANGE
    const tenant = buildTestId();
    const scheduleName = `${tenant}_OT_12345`;

    // ACT
    const { tenant: parsedTenant } = parseScheduleName(scheduleName);

    // ASSERT
    expect(parsedTenant).toEqual(tenant);
  });

  // Negative test cases
  describe('with an unknown code', () => {
    it('should throw a Bad Request error', () => {
      // ARRANGE
      const invalidScheduleName = 'ABCDEF_UNK_12345';

      // ACT & ASSERT
      expect(() => parseScheduleName(invalidScheduleName)).toThrow(/bad request/i);
    });
  });

  describe('with a malformed schedule name', () => {
    it('should throw a Bad Request error', () => {
      // ARRANGE
      const invalidScheduleName = 'ABCDEF#UNK#12345';

      // ACT & ASSERT
      expect(() => parseScheduleName(invalidScheduleName)).toThrow(/bad request/i);
    });
  });

  describe('with a missing id segment', () => {
    it('should throw a Bad Request error', () => {
      // ARRANGE
      const invalidScheduleName = 'ABCDEF_OT_';

      // ACT & ASSERT
      expect(() => parseScheduleName(invalidScheduleName)).toThrow(/bad request/i);
    });
  });

  describe('with a missing tenant segment', () => {
    it('should throw a Bad Request error', () => {
      // ARRANGE
      const invalidScheduleName = '_OT_12345';

      // ACT & ASSERT
      expect(() => parseScheduleName(invalidScheduleName)).toThrow(/bad request/i);
    });
  });
});
