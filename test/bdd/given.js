import { createOneTimeSchedule } from '../../src/repositories/eventBridgeScheduler';
import { buildOneTimeScheduleInput, buildTestId } from '../common/testDataGenerators';

const aOneTimeSchedule = async (tenant = buildTestId()) => {
  const oneTimeScheduleInput = buildOneTimeScheduleInput({ tenant });
  console.log('Creating one-time schedule with input', { oneTimeScheduleInput });
  const { id } = await createOneTimeSchedule(oneTimeScheduleInput);

  return { id, ...oneTimeScheduleInput };
};

const anId = () => buildTestId();

export { aOneTimeSchedule, anId };
