import { CreateScheduleCommand } from '@aws-sdk/client-scheduler';
// import { ulid } from "ulid";
import { getSchedulerClient } from '../common/schedulerClient';
import { createId } from '../common/utils';

const createOneTimeSchedule = async ({ tenant, timestamp }) => {
  const client = getSchedulerClient();
  const createScheduleCmd = new CreateScheduleCommand({
    Name: `ONETIME_${createId()}`,
    GroupName: tenant,
    ScheduleExpression: `at(${timestamp})`,
    Target: {
      Arn: process.env.ONE_TIME_SCHEDULE_TARGET_ARN,
      RoleArn: process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN,
    },
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
  });
  const result = await client.send(createScheduleCmd);

  return result;
};

export { createOneTimeSchedule };
