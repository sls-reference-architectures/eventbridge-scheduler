import middy from '@middy/core';

const executeRateBasedSchedule = async (event) => {
  console.log('In executeRateBasedSchedule', event);

  return { statusCode: 201 };
};

export const handler = middy().handler(executeRateBasedSchedule);
