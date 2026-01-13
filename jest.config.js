const config = {
  setupFilesAfterEnv: ['jest-extended/all'],
  testMatch: ['**/*.unit.test.js'],
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
};

export default config;
