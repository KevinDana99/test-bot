import { chromium, type Browser } from "playwright";

let browser: Browser | null = null;

export const instanceBrowser = async () => {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
  }

  const context = await browser.newContext();

  return { browser, context };
};

export const initBrowser = async () => {
  const { context } = await instanceBrowser();
  await context.close();
  console.log("🌐 Browser is running");
};
export default instanceBrowser;
