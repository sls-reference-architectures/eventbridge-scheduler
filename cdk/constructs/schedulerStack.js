import { CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ScheduleGroup } from 'aws-cdk-lib/aws-scheduler';

class SchedulerStack extends Stack {
  constructor({ scope, id, props }) {
    super(scope, id, props);
    const authorizer = new HttpIamAuthorizer();
    const api = new HttpApi(this, `${props.stageName}-${props.serviceName}`, {
      defaultAuthorizer: authorizer,
      deployOptions: {
        stageName: props.stageName,
      },
    });
    // Scheduler Groups
    new ScheduleGroup(this, 'SchedulerGroup', {
      scheduleGroupName: props.serviceName,
    });
    // Functions
    const createOneTimeScheduleFunction = this.createCreateOneTimeScheduleFunction(props);
    const executeOneTimeScheduleFunction = this.createExecuteOneTimeScheduleFunction(props);
    // Roles
    const invokeOneTimeScheduleRole = this.createInvokeOneTimeScheduleRole(
      executeOneTimeScheduleFunction.functionArn,
    );
    // Endpoints
    this.createApiEndpoints({ api, functions: { createOneTimeScheduleFunction } });

    // Outputs
    new CfnOutput(this, 'HttpApiUrl', {
      description: 'URL of the HTTP API',
      value: api.apiEndpoint,
    });
    new CfnOutput(this, 'ExecuteOneTimeScheduleFunctionArn', {
      description: 'ARN of the ExecuteOneTimeSchedule Lambda function',
      value: executeOneTimeScheduleFunction.functionArn,
    });
    new CfnOutput(this, 'InvokeOneTimeScheduleRoleArn', {
      description: 'ARN of the InvokeOneTimeSchedule IAM Role',
      value: invokeOneTimeScheduleRole.roleArn,
    });
  }

  // Functions
  createCreateOneTimeScheduleFunction(props) {
    return this.createFunction({
      props,
      fileName: 'createOneTimeSchedule.js',
      logicalId: 'CreateOneTimeScheduleFunction',
    });
  }
  createExecuteOneTimeScheduleFunction(props) {
    return this.createFunction({
      props,
      fileName: 'executeOneTimeSchedule.js',
      logicalId: 'ExecuteOneTimeScheduleFunction',
    });
  }

  // API Endpoints
  createApiEndpoints({ api, functions }) {
    api.addRoutes({
      path: '/schedules/one-time',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'CreateOneTimeScheduleIntegration',
        functions.createOneTimeScheduleFunction,
      ),
    });
  }

  // IAM Roles
  createInvokeOneTimeScheduleRole(targetLambdaArn) {
    const invokeOneTimeScheduleRole = new Role(this, 'InvokeOneTimeScheduleRole', {
      assumedBy: new ServicePrincipal('scheduler.amazonaws.com'),
    });
    invokeOneTimeScheduleRole.addToPolicy(
      new PolicyStatement({
        actions: ['lambda:InvokeFunction'],
        resources: [targetLambdaArn],
      }),
    );

    return invokeOneTimeScheduleRole;
  }

  createFunction({ props, fileName, logicalId }) {
    const func = new NodejsFunction(this, logicalId, {
      bundling: {
        minify: true,
      },
      runtime: Runtime.NODEJS_24_X,
      handler: 'handler',
      entry: `./src/handlers/${fileName}`,
      memorySize: 1024,
      environment: {
        POWERTOOLS_LOG_LEVEL: props.stageName === 'prod' ? 'INFO' : 'DEBUG',
        SERVICE_NAME: props.serviceName,
        STAGE_NAME: props.stageName,
        STABLE_STAGE_NAME: props.stableStageName,
      },
    });

    return func;
  }
}

export { SchedulerStack };
