const region = process.env.AWS_REGION || 'us-east-1';

const setup = async () => {
  // Add any setup needed for INT tests here
  process.env.AWS_REGION = region;
  process.env.ONE_TIME_SCHEDULE_TARGET_ARN =
    'arn:aws:lambda:us-east-1:123456789012:function:MyFunction'; // TODO: import from stack
  process.env.ONE_TIME_SCHEDULE_TARGET_ROLE_ARN = 'arn:aws:iam::123456789012:role/MyRole'; // TODO: import from stack
};

export default setup;
