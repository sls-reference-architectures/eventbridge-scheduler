import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { ScheduleType, SERVICE_NAME } from '../../src/common/constants';
import { getTypeCode } from '../../src/transformers/scheduleTransformer';

const buildExecutionInput = (overrideWith) => {
  const defaultExecutionInput = {
    url: faker.internet.url(),
    method: 'POST',
    body: {
      message: faker.lorem.sentence(),
    },
  };

  return {
    ...defaultExecutionInput,
    ...overrideWith,
  };
};

const buildOneTimeScheduleInput = (overrideWith) => {
  const defaultInput = {
    tenant: buildTestId(),
    executionTimestamp: faker.date.soon().toISOString(),
    executionInput: buildExecutionInput(),
  };

  return {
    ...defaultInput,
    ...overrideWith,
  };
};

const buildRateBasedScheduleInput = (overrideWith) => {
  const defaultInput = {
    tenant: buildTestId(),
    rateValueUnit: '6 hours',
    executionInput: buildExecutionInput(),
    endDate: faker.date.soon().toISOString(),
  };

  return {
    ...defaultInput,
    ...overrideWith,
  };
};

const buildAwsSchedule = ({
  id = buildTestId(),
  tenant = buildTestId(),
  type = faker.helpers.arrayElement(Object.values(ScheduleType)),
  executionInput = buildExecutionInput(),
} = {}) => {
  const typeCode = getTypeCode(type);
  const awsSchedule = {
    Arn: faker.lorem.slug(),
    GroupName: SERVICE_NAME,
    Name: `${tenant}_${typeCode}_${id}`,
    Target: {
      Arn: faker.lorem.slug(),
      RoleArn: faker.lorem.slug(),
      Input: JSON.stringify(executionInput),
    },
  };

  return { awsSchedule, id, tenant, type, executionInput };
};

const buildAwsScheduleSummary = ({
  id = buildTestId(),
  tenant = buildTestId(),
  type = faker.helpers.arrayElement(Object.values(ScheduleType)),
} = {}) => {
  const typeCode = getTypeCode(type);
  const awsSchedule = {
    Arn: faker.lorem.slug(),
    GroupName: SERVICE_NAME,
    Name: `${tenant}_${typeCode}_${id}`,
    CreationDate: faker.date.past().toISOString(),
    LastModificationDate: faker.date.recent().toISOString(),
    Target: {
      Arn: faker.lorem.slug(),
    },
  };

  return { awsSchedule, id, tenant, type };
};

const buildTestId = () => `TEST${ulid()}`;

export {
  buildOneTimeScheduleInput,
  buildRateBasedScheduleInput,
  buildTestId,
  buildAwsSchedule,
  buildAwsScheduleSummary,
};
