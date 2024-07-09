import * as cdk from 'aws-cdk-lib';
import { ScreenshotLib } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

new ScreenshotLib(stack, 'Cdk-Screenshot-Lib');