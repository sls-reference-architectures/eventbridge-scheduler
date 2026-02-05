import { createOneTimeSchedule } from '../../src/repositories/eventBridgeScheduler';
import { buildOneTimeScheduleInput, buildTestId } from '../common/testDataGenerators';

const aOneTimeSchedule = async (tenant = buildTestId()) => {
  const oneTimeScheduleInput = buildOneTimeScheduleInput({ tenant });
  const { id } = await createOneTimeSchedule(oneTimeScheduleInput);

  return { id, ...oneTimeScheduleInput };
};

const aTenant = () => buildTestId();

export { aOneTimeSchedule, aTenant };
