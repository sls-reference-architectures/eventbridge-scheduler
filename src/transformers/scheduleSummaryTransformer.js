import { parseScheduleName } from './commonTransformers';

const transformFromAwsToDomain = (awsSchedule) => {
  const { id, tenant, type } = parseScheduleName(awsSchedule.Name);
  const domainSchedule = {
    created: awsSchedule.CreationDate,
    id,
    tenant,
    type,
    updated: awsSchedule.LastModificationDate,
  };

  return domainSchedule;
};

export { transformFromAwsToDomain };
