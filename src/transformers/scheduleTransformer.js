import { parseExecutionInput, parseScheduleName } from './commonTransformers';

const transformFromAwsToDomain = (awsSchedule) => {
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

export { transformFromAwsToDomain };
