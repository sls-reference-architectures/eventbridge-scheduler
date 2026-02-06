import middy from '@middy/core';

const createRateBasedSchedule = async (event) => {
  console.log('In createRateBasedSchedule', event);

  return { statusCode: 201 };
};

export const handler = middy().handler(createRateBasedSchedule);
