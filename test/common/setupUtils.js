import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

const getStack = async (stackName) => {
  const cf = new CloudFormationClient({ region: process.env.AWS_REGION });
  const stackResult = await cf.send(
    new DescribeStacksCommand({
      StackName: stackName,
    }),
  );
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Could not find CFN stack with name ${stackName}`);
  }

  return stack;
};

const getHttpApiUrl = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue;

const getOneTimeScheduleTargetArn = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ExecuteOneTimeScheduleFunctionArn')?.OutputValue;

const getInvokeOneTimeScheduleRoleArn = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'InvokeOneTimeScheduleRoleArn')?.OutputValue;

export { getStack, getHttpApiUrl, getOneTimeScheduleTargetArn, getInvokeOneTimeScheduleRoleArn };
