import { CreateScheduleCommand, GetScheduleCommand } from '@aws-sdk/client-scheduler';
import { Logger } from '@aws-lambda-powertools/logger';

import { getSchedulerClient } from '../common/schedulerClient';
import { createId } from '../common/utils';
import { ONE_TIME_SCHEDULE_CODE, SERVICE_NAME } from '../common/constants';
import { transformFromAwsToDomain } from '../translators/scheduleTranslator';

const logger = new Logger({ serviceName: SERVICE_NAME });

const createOneTimeSchedule = async ({ tenant, executionTimestamp, executionInput }) => {
  const client = getSchedulerClient();
  const id = createId();
  const createScheduleCmd = new CreateScheduleCommand({
    Name: createOneTimeScheduleName({ tenant, id }),
    GroupName: SERVICE_NAME,
    ScheduleExpression: `at(${isoTimeStampToTheSecond(executionTimestamp)})`,
    Target: {
      Arn: process.env.ONE_TIME_SCHEDULE_TARGET_ARN,
      RoleArn: process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN,
      Input: JSON.stringify(executionInput),
    },
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
    ActionAfterCompletion: 'DELETE',
  });
  const result = await client.send(createScheduleCmd);
  logger.debug('One-time schedule created', { tenant, executionTimestamp, result });

  return {
    id,
  };
};

const fetchScheduleById = async ({ id, tenant }) => {
  const client = getSchedulerClient();
  const getScheduleCmd = new GetScheduleCommand({
    Name: createOneTimeScheduleName({ tenant, id }),
    GroupName: SERVICE_NAME,
  });
  const awsSchedule = await client.send(getScheduleCmd);
  const domainSchedule = transformFromAwsToDomain(awsSchedule);

  return domainSchedule;
};

const isoTimeStampToTheSecond = (iso8601Timestamp) => iso8601Timestamp.slice(0, 19);
const createOneTimeScheduleName = ({ id, tenant }) => `${tenant}_${ONE_TIME_SCHEDULE_CODE}_${id}`;

export { createOneTimeSchedule, fetchScheduleById };
