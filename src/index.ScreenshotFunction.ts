import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { LambdaFunctionURLHandler } from 'aws-lambda';
import { Browser, Page, chromium } from 'playwright-core';


export const handler: LambdaFunctionURLHandler = async (event) => {
  console.log(event);

  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing url. Please add ?url=https://...',
    };
  }

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-require-imports
    const install = require('playwright-core/lib/server').installBrowsersForNpmInstall;
    await install(['chromium']);

    browser = await chromium.launch({
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process'],
    });

    page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    const image = await page.screenshot({ type: 'png' });
    const key = `${new Date().toISOString()}.png`;

    const s3Client = new S3Client({});
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.FILES_BUCKET!,
      Key: key,
      Body: image,
    }));

    const s3Command = new GetObjectCommand({
      Bucket: process.env.FILES_BUCKET,
      Key: key,
    });

    const result = await getSignedUrl(s3Client, s3Command, {
      expiresIn: 600,
    });

    return { statusCode: 200, body: JSON.stringify({ screenshot: result }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify(e) };
  } finally {
    await page?.close();
    await browser?.close();
  }
};
