import {
  createOneTimeSchedule,
  createRateBasedSchedule,
} from '../../src/repositories/eventBridgeScheduler';
import {
  buildOneTimeScheduleInput,
  buildRateBasedScheduleInput,
  buildTestId,
} from '../common/testDataGenerators';

const aOneTimeSchedule = async (tenant = buildTestId()) => {
  const oneTimeScheduleInput = buildOneTimeScheduleInput({ tenant });
  const { id } = await createOneTimeSchedule(oneTimeScheduleInput);

  return { id, ...oneTimeScheduleInput };
};

const aRateBasedSchedule = async (tenant = buildTestId()) => {
  const rateBasedScheduleInput = buildRateBasedScheduleInput({ tenant });
  const { id } = await createRateBasedSchedule(rateBasedScheduleInput);

  return { id, ...rateBasedScheduleInput };
};

const anId = () => buildTestId();

export { aOneTimeSchedule, aRateBasedSchedule, anId };
