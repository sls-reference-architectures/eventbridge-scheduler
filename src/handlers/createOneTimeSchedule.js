import middy from '@middy/core';

const createOneTimeSchedule = async (event) => {
  console.log('In createOneTimeSchedule', event);

  return { statusCode: 201 };
};

export const handler = middy().handler(createOneTimeSchedule);
