import { CreateScheduleCommand } from '@aws-sdk/client-scheduler';
import { Logger } from '@aws-lambda-powertools/logger';
import { getSchedulerClient } from '../common/schedulerClient';
import { createId } from '../common/utils';
import { ONE_TIME_SCHEDULE_CODE, SERVICE_NAME } from '../common/constants';

const logger = new Logger({ serviceName: SERVICE_NAME });

const createOneTimeSchedule = async ({ tenant, executionTimestamp }) => {
  const client = getSchedulerClient();
  const name = createOneTimeScheduleName(tenant);
  const createScheduleCmd = new CreateScheduleCommand({
    Name: name,
    GroupName: SERVICE_NAME,
    ScheduleExpression: `at(${isoTimeStampToTheSecond(executionTimestamp)})`,
    Target: {
      Arn: process.env.ONE_TIME_SCHEDULE_TARGET_ARN,
      RoleArn: process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN,
      Input: JSON.stringify({ tenant, executionTimestamp }),
    },
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
    ActionAfterCompletion: 'DELETE',
  });
  const result = await client.send(createScheduleCmd);
  logger.debug('One-time schedule created', { tenant, executionTimestamp, result });

  return {
    name,
  };
};

const isoTimeStampToTheSecond = (iso8601Timestamp) => iso8601Timestamp.slice(0, 19);
const createOneTimeScheduleName = (tenant) => `${tenant}_${ONE_TIME_SCHEDULE_CODE}_${createId()}`;

export { createOneTimeSchedule };
