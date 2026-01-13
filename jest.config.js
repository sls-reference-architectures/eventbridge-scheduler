module.exports = {
  setupFilesAfterEnv: ['jest-extended/all'],
  testMatch: ['**/*.unit.test.js'],
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
};
