const SERVICE_NAME = 'sls-ra-eventbridge-scheduler';
const ONE_TIME_SCHEDULE_CODE = 'OT';
const RATE_BASED_SCHEDULE_CODE = 'RB';
const MAX_LIMIT = 100;

const ScheduleType = {
  ONE_TIME: 'ONE_TIME',
  RATE_BASED: 'RATE_BASED',
};

export { MAX_LIMIT, ONE_TIME_SCHEDULE_CODE, RATE_BASED_SCHEDULE_CODE, ScheduleType, SERVICE_NAME };
