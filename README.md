# Playwright Screenshot Construct for AWS CDK

This AWS CDK construct provides a simple way to create a screenshot of a URL using Chromium and Playwright on AWS Lambda. With this construct, you can easily integrate screenshotting functionality into your AWS-based applications.

## Getting Started

### Prerequisites

* AWS CDK version 2.x
* Node.js 14.x or higher
* AWS account with necessary permissions

## Usage

### Importing the Construct

1. In your AWS CDK project, import the `PlaywrightScreenshot` construct:
```typescript
import { ScreenshotLib } from '@chromium-for-lambda/playwright-screenshot';
```
### Creating the Construct

1. Create a new instance of the `ScreenshotLib` construct:
```typescript
const screenshotConstruct = new ScreenshotLib(this, 'ScreenshotLib');
```
### Synthesizing and Deploying

1. Synthesize the construct to create the necessary AWS resources:
```
cdk synth
```
2. Deploy the construct to AWS:
```
cdk deploy
```
## Using the Screenshot Function

Once the construct is deployed, you can call the Lambda function to create a screenshot of a URL. To do this, use the `?url=` query parameter to specify the URL you want to screenshot:
```
https://your-lambda-function-url.com/?url=https://example.com
```
The Lambda function will create a screenshot of the specified URL and store it in the specified screenshot bucket.

## Troubleshooting

If you encounter any issues with the construct, please check the AWS CloudWatch logs for errors. You can also reach out to the maintainers of this construct for assistance.

## License

This construct is licensed under the MIT license.
