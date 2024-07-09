import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Stephan Kaag',
  authorAddress: 'stephan@chromiumforlambda.org',
  cdkVersion: '2.148.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.4.0',
  name: '@chromium-for-lambda/playwright-screenshot',
  projenrcTs: true,
  license: 'MIT',
  repositoryUrl: 'https://github.com/chromium-for-lambda/playwright-screenshot.git',
  deps: [], /* Runtime dependencies of this module. */
  bundledDeps: ['playwright-core@1.41.2', '@aws-sdk/s3-request-presigner', '@aws-sdk/client-s3'],
  description: 'Use Chromium with Plawright to create website screenshots in AWS Lambda', /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['@types/aws-lambda'], /* Build dependencies for this module. */
});
project.synth();