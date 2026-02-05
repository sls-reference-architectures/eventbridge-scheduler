import { createOneTimeSchedule } from '../../src/repositories/eventBridgeScheduler';
import { buildOneTimeScheduleInput, buildTestId } from '../common/testDataGenerators';

const aOneTimeSchedule = async (tenant = buildTestId()) => {
  const oneTimeScheduleInput = buildOneTimeScheduleInput({ tenant });
  const { id } = await createOneTimeSchedule(oneTimeScheduleInput);

  return { id, ...oneTimeScheduleInput };
};

const anId = () => buildTestId();

export { aOneTimeSchedule, anId };
