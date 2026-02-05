import { BadRequest } from 'http-errors';
import { ONE_TIME_SCHEDULE_CODE, ScheduleType } from '../common/constants';

const parseExecutionInput = (awsSchedule) => {
  const executionInput = JSON.parse(awsSchedule.Target.Input);

  return executionInput;
};

const getTypeCode = (scheduleType) => {
  if (scheduleType === ScheduleType.ONE_TIME) {
    return ONE_TIME_SCHEDULE_CODE;
  }
  throw new BadRequest(`Bad Request: Unrecognized schedule type: ${scheduleType}`);
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

const transformFromAwsToDomain = (awsSchedule) => {
  console.log('Transforming AWS schedule to domain schedule', { awsSchedule });
  const { id, tenant, type } = parseScheduleName(awsSchedule.Name);
  const executionInput = parseExecutionInput(awsSchedule);
  const domainSchedule = {
    executionInput,
    id,
    tenant,
    type,
  };

  return domainSchedule;
};

export { getTypeCode, parseScheduleName, transformFromAwsToDomain };
