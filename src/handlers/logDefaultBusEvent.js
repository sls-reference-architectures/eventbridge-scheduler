import middy from '@middy/core';

const logDefaultBusEvent = async (event) => {
  console.log('In logDefaultBusEvent', event);

  return { statusCode: 200 };
};

export const handler = middy().handler(logDefaultBusEvent);
