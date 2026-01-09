import cdk from 'aws-cdk-lib';
import { SchedulerStack } from './constructs/schedulerStack.js';

const app = new cdk.App();

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

const serviceName = 'eventbridge-scheduler';

new SchedulerStack({
  scope: app,
  id: `${serviceName}-${stageName}`,
  props: {
    serviceName,
    stageName,
    stableStageName,
  },
});
