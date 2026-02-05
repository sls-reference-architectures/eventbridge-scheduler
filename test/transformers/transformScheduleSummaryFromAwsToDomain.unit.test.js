import { buildAwsScheduleSummary } from '../common/testDataGenerators';
import { transformFromAwsToDomain } from '../../src/transformers/scheduleSummaryTransformer';

describe('When translating an AWS schedule summary to a domain schedule summary', () => {
  it('should return the expected domain schedule summary', () => {
    // ARRANGE
    const { awsSchedule, id, tenant, type } = buildAwsScheduleSummary();

    // ACT
    const domainSchedule = transformFromAwsToDomain(awsSchedule);

    // ASSERT
    expect(domainSchedule.id).toEqual(id);
    expect(domainSchedule.tenant).toEqual(tenant);
    expect(domainSchedule.type).toEqual(type);
    expect(domainSchedule.created).toEqual(awsSchedule.CreationDate);
    expect(domainSchedule.updated).toEqual(awsSchedule.LastModificationDate);
  });
});
