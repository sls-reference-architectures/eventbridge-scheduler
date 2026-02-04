import { CreateScheduleCommand, CreateScheduleGroupCommand } from '@aws-sdk/client-scheduler';
import { Logger } from '@aws-lambda-powertools/logger';
import { getSchedulerClient } from '../common/schedulerClient';
import { createId } from '../common/utils';
import { EVENTBRIDGE_SCHEDULER_GROUP_NAME, SERVICE_NAME } from '../common/constants';

const logger = new Logger({ serviceName: SERVICE_NAME });

const createOneTimeSchedule = async ({ tenant, timestamp }) => {
  const client = getSchedulerClient();
  await ensureScheduleGroup(EVENTBRIDGE_SCHEDULER_GROUP_NAME);
  const createScheduleCmd = new CreateScheduleCommand({
    Name: `TENANT_${tenant}_ONETIME_${createId()}`,
    GroupName: createScheduleGroupName(EVENTBRIDGE_SCHEDULER_GROUP_NAME),
    ScheduleExpression: `at(${isoTimeStampToTheSecond(timestamp)})`,
    Target: {
      Arn: process.env.ONE_TIME_SCHEDULE_TARGET_ARN,
      RoleArn: process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN,
    },
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
  });
  const result = await client.send(createScheduleCmd);
  logger.debug('One-time schedule created', { tenant, timestamp, result });

  return {
    name: createScheduleCmd.Name,
    group: createScheduleGroupName(EVENTBRIDGE_SCHEDULER_GROUP_NAME),
  };
};

const ensureScheduleGroup = async (tenant) => {
  const client = getSchedulerClient();
  const createScheduleGroupCmd = new CreateScheduleGroupCommand({
    Name: createScheduleGroupName(tenant),
    ClientToken: tenant,
  });
  const result = await client.send(createScheduleGroupCmd);
  logger.debug('Schedule group created', { tenant, result });
};

const createScheduleGroupName = (tenant) => `TENANT_${tenant}`;
const isoTimeStampToTheSecond = (iso8601Timestamp) => iso8601Timestamp.slice(0, 19);
export { createOneTimeSchedule };
