import { buildAwsSchedule } from '../common/testDataGenerators';
import { transformFromAwsToDomain } from '../../src/translators/scheduleTranslator';

describe('When translating an AWS schedule to a domain schedule', () => {
  it('should return the expected domain schedule', () => {
    // ARRANGE
    const { awsSchedule, id, tenant, type, executionInput } = buildAwsSchedule();

    // ACT
    const domainSchedule = transformFromAwsToDomain(awsSchedule);

    // ASSERT
    expect(domainSchedule.id).toEqual(id);
    expect(domainSchedule.tenant).toEqual(tenant);
    expect(domainSchedule.type).toEqual(type);
    expect(domainSchedule.executionInput).toEqual(executionInput);
  });
});
