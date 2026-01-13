import { SchedulerClient } from '@aws-sdk/client-scheduler';

let client;

const getSchedulerClient = () => {
  if (!client) {
    client = new SchedulerClient({ region: process.env.AWS_REGION });
  }
  return client;
};

export { getSchedulerClient };
