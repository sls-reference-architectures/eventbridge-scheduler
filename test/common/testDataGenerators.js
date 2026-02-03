import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

const buildOneTimeScheduleInput = () => ({
  tenant: buildTestId(),
  timestamp: faker.date.future().toISOString(),
});

const buildTestId = () => `TEST_${ulid()}`;

export { buildOneTimeScheduleInput, buildTestId };
