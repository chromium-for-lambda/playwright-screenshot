"use strict";

// lib/index.ScreenshotFunction.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var playwright_core_1 = require("playwright-core");
var handler = async (event) => {
  console.log(event);
  const url = event.queryStringParameters?.url;
  if (!url) {
    return {
      statusCode: 400,
      body: "Missing url. Please add ?url=https://..."
    };
  }
  let browser = null;
  let page = null;
  try {
    const install = require("playwright-core/lib/server").installBrowsersForNpmInstall;
    await install(["chromium"]);
    browser = await playwright_core_1.chromium.launch({
      args: ["--use-gl=angle", "--use-angle=swiftshader", "--single-process"]
    });
    page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 1e4
    });
    await new Promise((r) => setTimeout(r, 500));
    const image = await page.screenshot({ type: "png" });
    const key = `${(/* @__PURE__ */ new Date()).toISOString()}.png`;
    const s3Client = new client_s3_1.S3Client({});
    await s3Client.send(new client_s3_1.PutObjectCommand({
      Bucket: process.env.FILES_BUCKET,
      Key: key,
      Body: image
    }));
    const s3Command = new client_s3_1.GetObjectCommand({
      Bucket: process.env.FILES_BUCKET,
      Key: key
    });
    const result = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, s3Command, {
      expiresIn: 60
    });
    return { statusCode: 302, headers: { location: result } };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify(e) };
  } finally {
    await page?.close();
    await browser?.close();
  }
};
exports.handler = handler;
