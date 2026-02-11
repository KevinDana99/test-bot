import initBot from "@/bot";
import { bot } from "@/bot/config";
import "dotenv/config";
import express from "express";
import router from "./router";
import config from "@/config";
import verifyApi from "./utils/verifyApi";
import { initBrowser } from "./router/v1/services/ScrapingService/browser";

const app = express();
//midlewares
app.use(express.json());
//seters
app.set("json spaces", 2);
//router
router(app);
//exeptionhandlers
app.listen(config.PORT, async () => {
  try {
    await verifyApi();
    await initBrowser();
    initBot(bot);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error(err.message);
    }
  }
  console.log(`on port ${config.PORT}`);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
