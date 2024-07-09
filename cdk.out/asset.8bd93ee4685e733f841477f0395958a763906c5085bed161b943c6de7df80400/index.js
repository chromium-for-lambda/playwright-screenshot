"use strict";

// lib/index.ScreenshotFunction.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var playwright_core_1 = require("playwright-core");
var handler = async (event) => {
  console.log(event);
  const url = event.queryStringParameters?.url;
  if (!url) {
    throw "Missing url";
  }
  const install = require("playwright-core/lib/server").installBrowsersForNpmInstall;
  await install(["chromium"]);
  const browser = await playwright_core_1.chromium.launch({
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--single-process"]
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 1e4
  });
  await new Promise((r) => setTimeout(r, 500));
  const image = await page.screenshot({ type: "png" });
  return { body: image.toString("base64"), isBase64Encoded: true };
};
exports.handler = handler;
