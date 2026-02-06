import { BadRequest } from 'http-errors';
import {
  ONE_TIME_SCHEDULE_CODE,
  RATE_BASED_SCHEDULE_CODE,
  ScheduleType,
} from '../common/constants';

const getTypeCode = (scheduleType) => {
  if (scheduleType === ScheduleType.ONE_TIME) {
    return ONE_TIME_SCHEDULE_CODE;
  }
  if (scheduleType === ScheduleType.RATE_BASED) {
    return RATE_BASED_SCHEDULE_CODE;
  }
  throw new BadRequest(`Bad Request: Unrecognized schedule type: ${scheduleType}`);
};

const parseExecutionInput = (awsSchedule) => {
  const executionInput = JSON.parse(awsSchedule.Target.Input);

  return executionInput;
};

const parseScheduleName = (scheduleName) => {
  const id = parseIdFromScheduleName(scheduleName);
  const tenant = parseTenantFromScheduleName(scheduleName);
  const type = parseTypeFromScheduleName(scheduleName);

  return { id, tenant, type };
};

const parseTenantFromScheduleName = (scheduleName) => {
  const tenant = scheduleName.split('_')[0];
  if (!tenant) {
    throw new BadRequest(`Bad Request: Missing tenant segment in schedule name: ${scheduleName}`);
  }

  return tenant;
};

const parseTypeFromScheduleName = (scheduleName) => {
  const code = scheduleName.split('_')[1];
  if (code === ONE_TIME_SCHEDULE_CODE) {
    return ScheduleType.ONE_TIME;
  }
  if (code === RATE_BASED_SCHEDULE_CODE) {
    return ScheduleType.RATE_BASED;
  }
  throw new BadRequest(
    `Bad Request: Unrecognized schedule type code in schedule name: ${scheduleName}`,
  );
};

const parseIdFromScheduleName = (scheduleName) => {
  const id = scheduleName.split('_')[2];
  if (!id) {
    throw new BadRequest(`Bad Request: Missing id segment in schedule name: ${scheduleName}`);
  }

  return id;
};

export { getTypeCode, parseExecutionInput, parseScheduleName };
