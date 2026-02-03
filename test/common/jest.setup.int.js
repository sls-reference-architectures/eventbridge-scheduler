import {
  getInvokeOneTimeScheduleRoleArn,
  getOneTimeScheduleTargetArn,
  getStack,
} from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async () => {
  process.env.AWS_REGION = region;

  const stackName = `eventbridge-scheduler-${stage}`;
  const stack = await getStack(stackName);
  process.env.ONE_TIME_SCHEDULE_TARGET_ARN = getOneTimeScheduleTargetArn(stack);
  process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN = getInvokeOneTimeScheduleRoleArn(stack);
};

export default setup;
