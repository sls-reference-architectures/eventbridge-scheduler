import {
  CreateScheduleCommand,
  GetScheduleCommand,
  ListSchedulesCommand,
} from '@aws-sdk/client-scheduler';
import { Logger } from '@aws-lambda-powertools/logger';
import { NotFound } from 'http-errors';

import { getSchedulerClient } from '../common/schedulerClient';
import { createId } from '../common/utils';
import { MAX_LIMIT, ONE_TIME_SCHEDULE_CODE, SERVICE_NAME } from '../common/constants';
import { transformFromAwsToDomain as transformScheduleFromAwsToDomain } from '../transformers/scheduleTransformer';
import { transformFromAwsToDomain as transformScheduleSummaryFromAwsToDomain } from '../transformers/scheduleSummaryTransformer';

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
  try {
    const client = getSchedulerClient();
    const getScheduleCmd = new GetScheduleCommand({
      Name: createOneTimeScheduleName({ tenant, id }),
      GroupName: SERVICE_NAME,
    });
    const awsSchedule = await client.send(getScheduleCmd);
    const domainSchedule = transformScheduleFromAwsToDomain(awsSchedule);

    return domainSchedule;
  } catch (error) {
    logger.error('Error fetching schedule by ID', { id, tenant, error });
    if (error.name === 'ResourceNotFoundException') {
      throw new NotFound(`Not Found: No schedule found with id ${id} for tenant ${tenant}`);
    }
    throw error;
  }
};

const fetchAllSchedules = async ({ limit = MAX_LIMIT, tenant }) => {
  const client = getSchedulerClient();
  const listSchedulesCmd = new ListSchedulesCommand({
    GroupName: SERVICE_NAME,
    MaxResults: limit,
    NamePrefix: tenant,
  });
  const result = await client.send(listSchedulesCmd);
  console.log(JSON.stringify(result, null, 2));

  return {
    next: result.NextToken,
    results: result.Schedules.map(transformScheduleSummaryFromAwsToDomain),
  };
};

const isoTimeStampToTheSecond = (iso8601Timestamp) => iso8601Timestamp.slice(0, 19);
const createOneTimeScheduleName = ({ id, tenant }) => `${tenant}_${ONE_TIME_SCHEDULE_CODE}_${id}`;

export { createOneTimeSchedule, fetchScheduleById, fetchAllSchedules };
