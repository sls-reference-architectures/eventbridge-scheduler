import {
  getInvokeOneTimeScheduleRoleArn,
  getInvokeRateBasedScheduleRoleArn,
  getOneTimeScheduleTargetArn,
  getRateBasedScheduleTargetArn,
  getStack,
} from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async () => {
  process.env.POWERTOOLS_LOG_LEVEL = 'DEBUG';
  process.env.POWERTOOLS_LOGGER_SAMPLE_RATE = 1;
  process.env.POWERTOOLS_DEV = true;
  process.env.AWS_REGION = region;

  const stackName = `sls-ra-eventbridge-scheduler-${stage}`;
  const stack = await getStack(stackName);
  process.env.ONE_TIME_SCHEDULE_TARGET_ARN = getOneTimeScheduleTargetArn(stack);
  process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN = getInvokeOneTimeScheduleRoleArn(stack);
  process.env.RATE_BASED_SCHEDULE_TARGET_ARN = getRateBasedScheduleTargetArn(stack);
  process.env.RATE_BASED_SCHEDULE_TARGET_ROLE_ARN = getInvokeRateBasedScheduleRoleArn(stack);
};

export default setup;
