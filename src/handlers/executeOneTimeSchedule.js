import middy from '@middy/core';

const executeOneTimeSchedule = async (event) => {
  console.log('In executeOneTimeSchedule', event);

  return { statusCode: 200 };
};

export const handler = middy().handler(executeOneTimeSchedule);
