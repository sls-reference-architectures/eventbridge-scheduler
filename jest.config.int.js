const baseConfig = require('./jest.config.js');

const config = {
  ...baseConfig,
  globalSetup: './test/common/jest.setup.int.js',
  testMatch: ['**/*.int.test.js'],
  testTimeout: 120000,
};

module.exports = config;
