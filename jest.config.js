module.exports = {
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  testMatch: ['**/*.unit.test.js'],
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@aws-sdk))'],
};
