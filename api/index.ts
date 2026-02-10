import initBot from "@/bot";
import { bot } from "@/bot/config";
import "dotenv/config";
import express from "express";
import router from "./router";
import config from "@/config";

const app = express();
//midlewares
app.use(express.json());
//router
router(app);
//exeptionhandlers
app.listen(config.PORT, () => {
  initBot(bot);
  console.log(`on port ${config.PORT}`);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
