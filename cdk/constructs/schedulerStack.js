import { CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

class SchedulerStack extends Stack {
  constructor({ scope, id, props }) {
    super(scope, id, props);
    const api = new HttpApi(this, `${props.stageName}-${props.serviceName}`, {
      deployOptions: {
        stageName: props.stageName,
      },
    });
    const createOneTimeScheduleFunction = this.createCreateOneTimeScheduleFunction(props);
    this.createApiEndpoints({ api, functions: { createOneTimeScheduleFunction } });

    // Outputs
    new CfnOutput(this, 'HttpApiUrl', {
      description: 'URL of the HTTP API',
      value: api.apiEndpoint,
    });
  }

  createCreateOneTimeScheduleFunction(props) {
    return this.createFunction({
      props,
      fileName: 'createOneTimeSchedule.js',
      logicalId: 'CreateOneTimeScheduleFunction',
    });
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
}

export { SchedulerStack };
