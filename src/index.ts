import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Architecture, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class ScreenshotLib extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const screenshotBucket = new Bucket(this, 'Screenshots', {
      lifecycleRules: [{ expiration: Duration.days(1) }],
    });

    const screenshotFunction = new NodejsFunction(this, 'ScreenshotFunction', {
      runtime: Runtime.NODEJS_20_X,
      environment: {
        FILES_BUCKET: screenshotBucket.bucketName,
        PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST: 'https://files.chromiumforlambda.org/amazon-linux-2023/arm64',
        PLAYWRIGHT_BROWSERS_PATH: '/tmp',
      },
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(60),
      memorySize: 1024,
      bundling: {
        nodeModules: ['playwright-core'],
      },
      logRetention: RetentionDays.ONE_DAY,
    });

    screenshotBucket.grantReadWrite(screenshotFunction);

    const functionUrl = screenshotFunction.addFunctionUrl({ authType: FunctionUrlAuthType.NONE });

    new CfnOutput(this, 'ApiURL', { value: functionUrl.url! });
  }
};
