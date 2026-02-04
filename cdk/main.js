import cdk from 'aws-cdk-lib';
import { SchedulerStack } from './constructs/schedulerStack.js';
import { SERVICE_NAME } from '../src/common/constants.js';

const app = new cdk.App();

const serviceName = SERVICE_NAME;
let stageName = app.node.tryGetContext('stageName');
let stableStageName = app.node.tryGetContext('stableStageName');

if (!stageName) {
  console.log('Defaulting stage name to dev');
  stageName = 'dev';
}

if (!stableStageName) {
  console.log('Defaulting stable stage name to stageName');
  stableStageName = stageName;
}

new SchedulerStack({
  scope: app,
  id: `${serviceName}-${stageName}`,
  props: {
    serviceName,
    stageName,
    stableStageName,
  },
});
