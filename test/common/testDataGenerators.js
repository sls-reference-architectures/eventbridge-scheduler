import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

const buildOneTimeScheduleInput = (overrideWith) => {
  const defaultInput = {
    tenant: buildTestId(),
    timestamp: faker.date.future().toISOString(),
  };

  return {
    ...defaultInput,
    ...overrideWith,
  };
};

const buildTestId = () => `TEST${ulid()}`;

export { buildOneTimeScheduleInput, buildTestId };
